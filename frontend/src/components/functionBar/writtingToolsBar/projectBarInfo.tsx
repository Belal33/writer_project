import { useAppSelector } from "@/rtk/store";
import { CircleCheckIcon, LoaderCircleIcon, CreditCard } from "lucide-react";

export default function ProjectBarInfo() {
	const currentUserProject = useAppSelector(
		(state) => state.currentUserProject
	);

	return (
		<div className="flex flex-wrap  gap-4 items-center">
			<div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all duration-200">
				<StateLabel label="Credits" value={currentUserProject.value.used_credits} />
				<StateLabel label="Words" value={currentUserProject.value.article_text?.split(" ").filter(Boolean).length||0} />
				<StateLabel label="Characters" value={currentUserProject.value.article_text?.length||0} />
				<div className="pl-2 border-l border-gray-200">
					{(currentUserProject.status === "pending" ||
						currentUserProject.status === "updating") && (
						<LoaderCircleIcon className="w-4 h-4 animate-spin text-blue-500" />
					)}
					{currentUserProject.status === "updated" && (
						<CircleCheckIcon className="w-4 h-4 text-green-500" />
					)}
				</div>
			</div>
			<h1 className="font-semibold capitalize text-xl text-gray-800">
				{currentUserProject.value.name}
			</h1>
		</div>
	);
}
function StateLabel({label,value}:{label:string,value:string|number}) {
	return <div className="flex items-center flex-col">
		<span className="text-xs p-0 font-medium text-gray-600">
			{label}
		</span>
		<span className="font-semibold text-gray-900">
			{value}
		</span>
	</div>;
}

