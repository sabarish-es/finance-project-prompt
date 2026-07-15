import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dbPath = path.resolve(process.cwd(), '.data');

// Ensure data directory exists
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

interface Collection<T> {
  table: string;
  data: T[];
}

class SimpleDB {
  private dataPath: string;

  constructor() {
    this.dataPath = dbPath;
  }

  private getFilePath(tableName: string): string {
    return path.join(this.dataPath, `${tableName}.json`);
  }

  private readTable<T>(tableName: string): T[] {
    try {
      const filePath = this.getFilePath(tableName);
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error(`[DB] Error reading table ${tableName}:`, error);
      return [];
    }
  }

  private writeTable<T>(tableName: string, data: T[]): void {
    try {
      const filePath = this.getFilePath(tableName);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`[DB] Error writing table ${tableName}:`, error);
    }
  }

  insert<T extends { id?: string }>(table: string, values: T): T {
    const data = this.readTable<T>(table);
    const newRecord = { ...values, id: values.id || uuidv4(), createdAt: new Date(), updatedAt: new Date() };
    data.push(newRecord);
    this.writeTable(table, data);
    return newRecord;
  }

  select(table: string): any[] {
    return this.readTable(table);
  }

  update<T extends { id: string }>(table: string, id: string, updates: Partial<T>): void {
    const data = this.readTable<T>(table);
    const index = data.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updates, updatedAt: new Date() };
      this.writeTable(table, data);
    }
  }

  delete(table: string, id: string): void {
    const data = this.readTable(table);
    const filtered = data.filter((item: any) => item.id !== id);
    this.writeTable(table, filtered);
  }

  query(table: string): QueryBuilder {
    return new QueryBuilder(this, table);
  }
}

class QueryBuilder {
  private db: SimpleDB;
  private table: string;
  private whereConditions: ((item: any) => boolean)[] = [];
  private orderByFn?: (a: any, b: any) => number;
  private limitNum?: number;

  constructor(db: SimpleDB, table: string) {
    this.db = db;
    this.table = table;
  }

  where(condition: (item: any) => boolean): this {
    this.whereConditions.push(condition);
    return this;
  }

  orderBy(fn: (a: any, b: any) => number): this {
    this.orderByFn = fn;
    return this;
  }

  limit(n: number): this {
    this.limitNum = n;
    return this;
  }

  execute(): any[] {
    let results = this.db.select(this.table);

    for (const condition of this.whereConditions) {
      results = results.filter(condition);
    }

    if (this.orderByFn) {
      results.sort(this.orderByFn);
    }

    if (this.limitNum) {
      results = results.slice(0, this.limitNum);
    }

    return results;
  }

  first(): any {
    const results = this.execute();
    return results[0] || null;
  }
}

export const db = new SimpleDB();
