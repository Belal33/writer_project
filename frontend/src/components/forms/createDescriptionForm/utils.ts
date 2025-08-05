import postCreateDescriptionAction from "@/endpointActions/postCreateDescriptionAction";
import { CreateProjectDescriptionDataInterface } from "./createDescriptionForm";
const lang = {
	en: "English",
	ar: "Arabic",
	fr: "French",
};

export async function onSubmitCreateDescriptionFrom(
	values: CreateProjectDescriptionDataInterface
) {
	const res = await postCreateDescriptionAction({
		title: `  ${values.targeted_field}  ${values.written_content}   
				Title:  '${values.title}
				Language: ${lang[values.lang]}
				'`,
	});
	return res.data as string[];
}
export function validateCreateDescriptionForm(
	values: CreateProjectDescriptionDataInterface,
	userArticles: ProjectInterface[]
) {
	const errors: any = {};
	console.log("validateCreateArticleForm");

	if (values?.title?.length > 200) {
		errors.title = " |maximum  200 characters";
	}
	if (values?.title?.length < 3) {
		errors.title = " |minimum  3 characters";
	}
	if (values?.name?.length < 3) {
		errors.name = " |minimum  3 characters";
	}
	for (let userArticle of userArticles) {
		if (values?.name === userArticle?.name) {
			errors.name = " |must be unique";
		}
	}
	if (!values?.title) {
		errors.title = " | required";
	}
	if (!values?.name) {
		errors.name = " | required";
	}

	if (!values?.targeted_field) {
		errors.targeted_field = " required";
	}
	if (!values?.written_content) {
		errors.written_content = " required";
	}
	if (!values?.lang) {
		errors.lang = " |required";
	}

	return errors;
}
