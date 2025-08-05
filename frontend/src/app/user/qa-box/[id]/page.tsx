"use client";
import authProtection from "@/auth/authProtection";
import QABox from "@/components/qabox/qabox";
import { uuidRegex } from "@/regex/uuid";
import { notFound } from "next/navigation";
function QABoxPage({ params }: { params: any }) {
	const { id } = params;

	if (uuidRegex.test(id)) 
		return <QABox id={id} />;
	else return notFound();
}

export default authProtection(QABoxPage);
