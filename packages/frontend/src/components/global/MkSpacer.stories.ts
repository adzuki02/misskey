/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-default-export */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/order */
import { Meta, StoryObj } from '@storybook/vue3';
import MkSpacer from './MkSpacer.vue';
const meta = {
	title: 'components/global/MkSpacer',
	component: MkSpacer,
} satisfies Meta<typeof MkSpacer>;
export const Default = {
	render(args) {
		return {
			components: {
				MkSpacer,
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
			template: '<MkSpacer v-bind="props" />',
		};
	},
	parameters: {
		layout: 'centered',
	},
} satisfies StoryObj<typeof MkSpacer>;
export default meta;
