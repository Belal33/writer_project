import { setprojectOpenedTool } from "@/rtk/slices/projectOpenedTool";
import { useAppDispatch, useAppSelector } from "@/rtk/store";
import writtingTools from "./writtingToolsData";
import { SimpleTooltip } from "../../simpleTooltip";
import ProjectBarInfo from "./projectBarInfo";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import pagePaths from "@/urlPaths/pagePaths";

export default function WritingToolsBar() {
	const appDispatch = useAppDispatch();
	const openedTool = useAppSelector((state) => state.projectOpenedTool);
	const currentUserProject = useAppSelector(
		(state) => state.currentUserProject
	);

	return (
		<div
			className={`
      right-0 
      ${
				openedTool.id ? "top-0" : "absolute bottom-4"
			}      px-4 md:px-6 flex flex-col sm:flex-row sm:flex-wrap items-center justify-between w-full z-10 
      py-3 transition-all duration-500 ease-in-out delay-200 
      bg-gradient-to-r from-[#aa2236]/5 bg-white via-white to-primary/5 border-b gap-3  border-gray-200 shadow-md
      backdrop-blur-sm
    `}
		>
			<ProjectBarInfo />

			<div className="flex items-center justify-end gap-4">
				<nav className="relative">
					<ul className="flex flex-row-reverse pointer-events-auto gap-3 items-center">
						{writtingTools.map((tool) => (
							<li
								key={tool.id}
								className={`transform transition-all duration-300 ease-in-out ${
									openedTool.id === tool.id ? "text-action" : ""
								}`}
							>
								<SimpleTooltip tooltip={tool.description} delay={0}>
									<button
										className={`
													relative p-3 rounded-lg flex items-center justify-center
													transition-all duration-300 ease-in-out
													hover:scale-105 hover:shadow-md border bg-white
                      						${
																		openedTool.id === tool.id
																			? " text-action border-action/20  shadow-md scale-105"
																			: " bg-action/5 text-gray-600 hover:text-action  border-gray-200 hover:border-action/20"
																	}
                    `}
										onClick={() => {
											appDispatch(setprojectOpenedTool(tool));
										}}
									>
										<tool.Icon
											className={`w-5 h-5  transition-transform duration-300 ${
												openedTool.id === tool.id ? "scale-110" : ""
											}`}
										/>
									</button>
								</SimpleTooltip>
							</li>
						))}
						<SimpleTooltip tooltip="Back" delay={0}>
							<Link
								href={pagePaths.projectsPage}
								className={`
                                        relative p-3 rounded-lg flex items-center justify-center
                                        transition-all duration-300 ease-in-out 
                                        hover:scale-105 hover:shadow-md border bg-primary
                                        hover:text-action text-white  border-gray-200 hover:border-action/20
                                    `}
							>
								<ArrowLeftIcon className="w-5 h-5" />
							</Link>
						</SimpleTooltip>
					</ul>
				</nav>
			</div>
		</div>
	);
}
