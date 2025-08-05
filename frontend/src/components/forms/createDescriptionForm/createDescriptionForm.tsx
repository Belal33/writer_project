"use client";

import { Form } from "react-final-form";
import TextInput from "../formFiels/textInputField";
import FormButton from "../formFiels/formButton";
import useUserProjectsFetcher from "@/swrDataFetcher/userProjectsFetcher";
import { RadioInput } from "../formFiels/radioInputField";
import {
	TypesOfWrittenContent,
	FeildsOfWrittenContent,
} from "./writtenContent";
import {
	onSubmitCreateDescriptionFrom,
	validateCreateDescriptionForm,
} from "./utils";
import { useContext } from "react";
import { ProjectDataContext } from "@/components/projectCreationSection/projectCreationForms";

export interface CreateProjectDescriptionDataInterface {
	title: string;
	name: string;
	lang: string;
	written_content: string;
	targeted_field: string;
}

export default function CreateDescriptionForm() {
	const { projects } = useUserProjectsFetcher();
	const { projectData, setProjectData } = useContext(ProjectDataContext);

	return (
		<Form
			onSubmit={async (v) => {
				await onSubmitCreateDescriptionFrom(v).then((descriptions) => {
					setProjectData({
						...projectData,
						title: v.title,
						name: v.name,
						lang: v.lang,
						written_content: v.written_content,
						targeted_field: v.targeted_field,
						descriptions: descriptions,
					});
				});
			}}
			validate={(v: CreateProjectDescriptionDataInterface) => {
				return validateCreateDescriptionForm(v, projects||[]);

			}}
			initialValues={{
				written_content: "article",
				targeted_field: "scientific",
				lang: "en",
			}}
			render={({
				handleSubmit, //
				form, // form.reset
				submitSucceeded, //
				submitting, // submitting status use it to disable button
				values, // form values
			}) => {
				return (
					<form onSubmit={handleSubmit} className={`my-5 ${submitting}`}>
						<div className=" flex flex-wrap gap-5 mx-auto max-w-3xl ">
							<TextInput label={"Name"} name="name" values={values} />
							<TextInput label={"Title"} name="title" values={values} />

							<div className="flex flex-wrap gap-5">
								<RadioInput
									labels={["English", "Arabic"]}
									optionValues={["en", "ar"]}
									values={values}
									name="lang"
								/>
								<RadioInput
									labels={TypesOfWrittenContent.map(
										(type) => type.name
									)}
									optionValues={TypesOfWrittenContent.map(
										(type) => type.type
									)}
									values={values}
									name="written_content"
								/>
								<RadioInput
									labels={FeildsOfWrittenContent}
									optionValues={FeildsOfWrittenContent}
									values={values}
									name="targeted_field"
								/>
							</div>
						</div>

						<div className="buttons flex justify-end mt-10">
							<div className="w-full sm:w-auto">
								<FormButton
									label={
										submitSucceeded
											? "Regenerate Description"
											: "Generate Description"
									}
									submitting={submitting}
								/>
							</div>
						</div>
					</form>
				);
			}}
		/>
	);
}
