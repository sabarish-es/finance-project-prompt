'use server';

import { db } from './db';
import bcryptjs from 'bcryptjs';
import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-key-change-in-production'
);

interface Session {
  userId: string;
  email: string;
  name: string;
}

async function generateToken(session: Session): Promise<string> {
  return new SignJWT(session)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<Session | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as Session;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function signUp(email: string, password: string, name: string) {
  try {
    // Check if user exists
    const existingUsers = db.select('users') as any[];
    const existingUser = existingUsers.find((u) => u.email === email);

    if (existingUser) {
      return { error: 'User already exists' };
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const newUser = db.insert('users', {
      email,
      password: hashedPassword,
      name,
    });

    if (!newUser) {
      return { error: 'Failed to create user' };
    }

    // Create session
    const token = await generateToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true, userId: newUser.id };
  } catch (error) {
    console.error('[Auth] Sign up error:', error);
    return { error: 'Failed to sign up' };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const users = db.select('users') as any[];
    const user = users.find((u) => u.email === email);

    if (!user) {
      return { error: 'Invalid credentials' };
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      return { error: 'Invalid credentials' };
    }

    // Create session
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error('[Auth] Sign in error:', error);
    return { error: 'Failed to sign in' };
  }
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
  return { success: true };
}
