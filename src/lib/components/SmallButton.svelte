<script lang="ts">
	export let onClick: () => void;

	let classes = '';

	export { classes as class };
</script>

<button
	on:click={onClick}
	type="button"
	class="rounded-md bg-black/5 ring-1 ring-gray-900/10 px-3.5 py-2.5 text-xs font-semibold text-gray-900 shadow-sm hover:bg-black/10 {classes}"
	><slot>Button</slot></button
>
