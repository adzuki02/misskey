/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-default-export */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/order */
import { Meta, StoryObj } from '@storybook/vue3';
import MkFooterSpacer from './MkFooterSpacer.vue';
const meta = {
	title: 'components/global/MkFooterSpacer',
	component: MkFooterSpacer,
} satisfies Meta<typeof MkFooterSpacer>;
export const Default = {
	render(args) {
		return {
			components: {
				MkFooterSpacer,
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
			template: '<MkFooterSpacer v-bind="props" />',
		};
	},
	parameters: {
		layout: 'centered',
	},
} satisfies StoryObj<typeof MkFooterSpacer>;
export default meta;
