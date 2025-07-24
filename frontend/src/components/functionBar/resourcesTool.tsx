import { useAppSelector } from "@/rtk/store";
import QABoxUploadResource from "../qabox/qaboxUploadResource";
import PaperSearchBody from "../paperSearch/paperSearchBody";
import PaperSearchInput from "../paperSearch/paperSearchInput";

export default function ResourcesTool() {
	const currentUserProject = useAppSelector(
		(state) => state.currentUserProject
	);

	return (
		<div className="h-full flex flex-col bg-main">
			<div className="sticky top-0 z-10 bg-white border-b border-action/10 shadow-sm">
				<div className="max-w-5xl mx-auto px-4 py-6">
					{/* Header */}
					<div className="flex flex-col gap-6">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-primary">Resources</h2>
							{currentUserProject.value.qaBox && (
								<span className="text-sm text-mygray">QA Box Connected</span>
							)}
						</div>

						{/* Search Input */}
						<div className="w-full">
							<PaperSearchInput />
						</div>
					</div>
				</div>
			</div>

			{/* Scrollable Content */}
			<div className="flex-1 overflow-y-auto">
				<div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
					{/* QA Box Resources Section */}
					{/* {currentUserProject.value.qaBox && (
						<div className="bg-white rounded-lg shadow-sm border border-action/10 overflow-hidden">
							<QABoxUploadResource qaBoxId={currentUserProject.value.qaBox} />
						</div>
					)} */}

					{/* Paper Search Results Section */}
					<div className="bg-white rounded-lg shadow-sm border border-action/10 p-6">
						<PaperSearchBody />
					</div>
				</div>
			</div>
		</div>
	);
}
