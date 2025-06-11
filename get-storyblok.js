import 'dotenv/config';
import fetch from 'node-fetch';
import fs from 'fs';

const token = process.env.STORYBLOK_TOKEN;
const baseUrl = 'https://api.storyblok.com/v2';

const getImage = (story) => {
	if (!story.content) return;
	if (!story.content.image) return;
	return story.content.image;
};

const getImageId = (image) => {
	if (!image) return;
	return image.id;
};

const getImageUrl = (image) => {
	if (!image) return;
	const imageAffix = '/m/760x0'; // This resizes to 760px width
	return `${image.filename}${imageAffix}`;
};

const getImageExtension = (image) => {
	if (!image) return;
	const filename = image.filename;
	return filename.split('.').pop();
};

const downloadImage = async (imageUrl, imageId, imageExtension, mediaFolder) => {
	if (!mediaFolder) return;
	if (!imageUrl) return;
	if (!imageId) return;
	if (!imageExtension) return;

	const imageResponse = await fetch(imageUrl);
	if (!imageResponse.ok) {
		throw new Error('Image could not be fetched');
	}

	const imageBuffer = await imageResponse.arrayBuffer();
  const imageDataBuffer = Buffer.from(imageBuffer);
	fs.writeFileSync(`${mediaFolder}/${imageId}.${imageExtension}`, imageDataBuffer);
};

const downloadImages = async (stories, mediaFolder) => {
	if (!mediaFolder) return;
	if (!stories) return;

	stories.forEach(async (story) => {
		const image = getImage(story);
		const imageUrl = getImageUrl(image);
		const imageId = getImageId(image);
		const imageExtension = getImageExtension(image);

		await downloadImage(imageUrl, imageId, imageExtension, mediaFolder);
	});
};

const parseStories = (stories) => {
	let landing = {};
	let projects = [];
	let articles = [];

	stories.forEach((story) => {
		if (!story.content) return;
		if (!story.full_slug) return;

		if (story.full_slug.includes('projects')) {
			projects.push(story);
		} else if (story.full_slug.includes('articles')) {
			articles.push(story);
		} else if (story.full_slug.includes('landing')) {
			landing = story;
		}
	});

	return {
		landing,
		projects,
		articles
	};
};

const fetchStories = async (url) => {
	const storyResponse = await fetch(url);

	if (storyResponse.ok) {
		const stories = await storyResponse.json();
		if (stories && stories.stories) {
			return stories.stories;
		} else {
			throw new Error('No stories in Storyblok response');
		}
	} else {
		throw new Error('Error fetching stories:', storyResponse.statusText);
	}
};

const storyblokDownload = async (token = '', data_folder = './data', media_folder = './media') => {
	if (!token) {
		throw new Error('Missing token');
	}

	if (!fs.existsSync(data_folder)) {
		fs.mkdirSync(data_folder);
	}

	if (!fs.existsSync(media_folder)) {
		fs.mkdirSync(media_folder);
	}

	let data = {};

	const stories = await fetchStories(`${baseUrl}/cdn/stories?token=${token}&per_page=100`);

	if (stories) {
		data.stories = parseStories(stories);
		await downloadImages(stories, media_folder);

		fs.writeFile(`${data_folder}/data.json`, JSON.stringify(data), (error) => {
			if (error) {
				throw new Error(error);
			}
		});
	}
};

storyblokDownload(token, 'static/data', 'static/media');
