import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import AuthLayout from "../../components/layout/AuthLayout";
import authService from "../../services/authService";

function VerifyEmail() {
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const [status, setStatus] = useState(
		token ? "verifying" : "invalid"
	);

	useEffect(() => {
		if (!token) {
			return;
		}

		authService.verifyEmail(token)
			.then(() => setStatus("success"))
			.catch(() => setStatus("invalid"));
	}, [token]);

	const message = {
		verifying: "Verifying your email address...",
		success: "Your email has been verified. You can now sign in.",
		invalid: "This verification link is invalid or has expired.",
	}[status];

	return (
		<AuthLayout>
			<section className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8 sm:py-16">
				<div className="w-full max-w-md rounded-2xl border border-[#eeeafd] bg-white p-6 text-center shadow-lg shadow-[#7c3aed]/5 sm:p-8">
					<h1 className="text-2xl font-bold tracking-tight text-[#181827]">
						Email Verification
					</h1>
					<p className="mt-4 text-sm leading-6 text-gray-500">
						{message}
					</p>
					{status !== "verifying" && (
						<Link
							to="/login"
							className="mt-7 inline-block rounded-lg bg-[#7c3aed] px-5 py-3 text-sm font-semibold text-white"
						>
							Continue to sign in
						</Link>
					)}
				</div>
			</section>
		</AuthLayout>
	);
}

export default VerifyEmail;
