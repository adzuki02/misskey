/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-default-export */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/order */
import { Meta, StoryObj } from '@storybook/vue3';
import MkLazy from './MkLazy.vue';
const meta = {
	title: 'components/global/MkLazy',
	component: MkLazy,
} satisfies Meta<typeof MkLazy>;
export const Default = {
	render(args) {
		return {
			components: {
				MkLazy,
			},
			setup() {
				return {
					args,
				};
			},
			computed: {
				props() {
					return {
						...this.args,
					};
				},
			},
			template: '<MkLazy v-bind="props" />',
		};
	},
	parameters: {
		layout: 'centered',
	},
} satisfies StoryObj<typeof MkLazy>;
export default meta;
