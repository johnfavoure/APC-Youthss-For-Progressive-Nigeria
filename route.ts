import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  fullName: z.string().trim().min(3).max(100),
  dateOfBirth: z.string().min(1),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().min(7).max(20),
  stateName: z.string().trim().min(2).max(50),
  lgaName: z.string().trim().min(2).max(100),
  wardName: z.string().trim().max(100).optional().or(z.literal("")),
  address: z.string().trim().max(250).optional().or(z.literal("")),
  password: z.string().min(12).max(100),
  privacyConsent: z.literal("yes"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check the information entered and try again." }, { status: 400 });
    }

    const data = parsed.data;
    const dob = new Date(`${data.dateOfBirth}T00:00:00.000Z`);
    if (Number.isNaN(dob.getTime()) || dob >= new Date()) {
      return NextResponse.json({ error: "Enter a valid date of birth." }, { status: 400 });
    }
    const today = new Date();
    let age = today.getUTCFullYear() - dob.getUTCFullYear();
    const monthDiff = today.getUTCMonth() - dob.getUTCMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < dob.getUTCDate())) age--;
    if (age < 18) return NextResponse.json({ error: "Applicants must be at least 18 years old." }, { status: 400 });

    const phone = data.phone.replace(/[^\d+]/g, "");
    const email = data.email || null;
    const existing = await prisma.user.findFirst({
      where: { OR: [{ phone }, ...(email ? [{ email }] : [])] },
      select: { id: true },
    });
    if (existing) return NextResponse.json({ error: "An account with that phone number or email already exists." }, { status: 409 });

    const state = await prisma.state.findFirst({ where: { name: { equals: data.stateName, mode: "insensitive" } } });
    if (!state) return NextResponse.json({ error: "The selected state is not available yet. Please contact the platform administrator." }, { status: 400 });

    const lga = await prisma.lga.findFirst({
      where: { stateId: state.id, name: { equals: data.lgaName, mode: "insensitive" } },
    });
    if (!lga) return NextResponse.json({ error: "The LGA could not be verified for the selected state. Please check the name or contact support." }, { status: 400 });

    let wardId: string | undefined;
    if (data.wardName) {
      const ward = await prisma.ward.findFirst({
        where: { lgaId: lga.id, name: { equals: data.wardName, mode: "insensitive" } },
      });
      if (!ward) return NextResponse.json({ error: "The ward could not be verified for the selected LGA." }, { status: 400 });
      wardId = ward.id;
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const created = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, phone, passwordHash, role: "MEMBER" },
      });
      const member = await tx.member.create({
        data: {
          userId: user.id, fullName: data.fullName, dateOfBirth: dob,
          stateId: state.id, lgaId: lga.id, wardId,
          address: data.address || null, status: "PENDING",
        },
      });
      await tx.application.create({ data: { memberId: member.id, status: "PENDING" } });
      return member;
    });

    return NextResponse.json({ ok: true, reference: created.id.slice(0, 8).toUpperCase() }, { status: 201 });
  } catch (error) {
    console.error("Registration error", error);
    return NextResponse.json({ error: "The service is temporarily unavailable. Please try again later." }, { status: 500 });
  }
}
