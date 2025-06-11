export const prerender = true;
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch(`/data/data.json`);
	const landingData = await res.json();

	return { landingData };
};