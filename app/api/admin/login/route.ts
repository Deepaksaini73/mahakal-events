// filepath: d:\projects\MERN project\caters\caters\app\api\admin\login\route.ts
import { NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'

export const runtime = 'nodejs'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'deepak'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'deepak123'
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const username = String(body?.username ?? '').trim()
    const password = String(body?.password ?? '').trim()

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }

    const token = sign({ username }, JWT_SECRET, { expiresIn: '1h' })

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Admin login error:', error instanceof Error ? error.stack : error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}