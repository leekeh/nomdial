<script lang="ts">
	type option = {
		text: string;
		value: string;
		disabled?: boolean;
	};
	function onClickOutside(element, callback) {
		const onClick = (event) => !element.contains(event.target) && callback();
		document.body.addEventListener('mousedown', onClick);

		return {
			update(newCallback) {
				callback = newCallback;
			},

			destroy() {
				document.body.removeEventListener('mousedown', onClick);
			}
		};
	}

	type Props = {
		disabled?: boolean;
		error?: string;
		expand?: boolean;
		id?: string;
		label?: string;
		loading?: boolean;
		name?: string;
		options?: option[];
		placeholder?: string;
		readonly?: boolean;
		required?: boolean;
		value?: string;
		onSelectOption?: (option: option) => void;
	};

	let {
		disabled,
		error,
		label,
		id,
		name,
		options = [],
		placeholder,
		readonly,
		required,
		value = $bindable(),
		onSelectOption
	}: Props = $props();

	let filter = (text) => {
		const sanitized = text.trim().toLowerCase();

		return options.reduce((a, o) => {
			let match;

			if (o.options) {
				const options = o.options.filter((o) => o.text.toLowerCase().includes(sanitized));

				if (options.length) {
					match = { ...o, options };
				}
			} else if (o.text.toLowerCase().includes(sanitized)) {
				match = o;
			}

			match && a.push(match);

			return a;
		}, []);
	};

	let listElement: HTMLUListElement;
	let inputElement: HTMLInputElement;
	let list: option[] = $state([]);
	let isListOpen = $state(false);
	let selectedOption: option;

	async function onInputKeyup(event) {
		switch (event.key) {
			case 'Escape':
			case 'ArrowUp':
			case 'ArrowLeft':
			case 'ArrowRight':
			case 'Enter':
			case 'Tab':
			case 'Shift':
				break;
			case 'ArrowDown':
				await showList(event.target.value);
				listElement.querySelector(`[role="option"]:not([aria-disabled="true"])`)?.focus();

				event.preventDefault();
				event.stopPropagation();
				break;

			default:
				await showList(event.target.value);
		}
	}

	function onInputKeydown(event) {
		let flag = false;

		switch (event.key) {
			case 'Escape':
				hideList();
				flag = true;
				break;

			case 'Tab':
				hideList();
				break;
		}

		if (flag) {
			event.preventDefault();
			event.stopPropagation();
		}
	}

	// async function onInputClick(event) {
	// 	await showList(event.target.value);
	// 	// Scroll selected option into view.
	// 	listElement.querySelector(`[role="option"][data-value="${value}"]`)?.scrollIntoView();
	// }

	function onOptionClick(event) {
		if (!event.target.matches(`[role="option"]:not([aria-disabled="true"])`)) return;

		selectOption(event.target);
		hideList();
	}

	function onListKeyDown(event) {
		let flag = false;

		switch (event.key) {
			case 'ArrowUp':
				let prevOptionElement = event.target.previousElementSibling;

				while (prevOptionElement) {
					if (prevOptionElement.matches(`[role="option"]:not([aria-disabled="true"])`)) break;
					prevOptionElement = prevOptionElement.previousElementSibling;
				}

				prevOptionElement?.focus();
				flag = true;
				break;

			case 'ArrowDown':
				let nextOptionElement = event.target.nextElementSibling;

				while (nextOptionElement) {
					if (nextOptionElement.matches(`[role="option"]:not([aria-disabled="true"])`)) break;
					nextOptionElement = nextOptionElement.nextElementSibling;
				}

				nextOptionElement?.focus();
				flag = true;
				break;

			case 'Enter':
				selectOption(event.target);
				hideList();
				flag = true;
				break;

			case 'Escape':
				hideList();
				flag = true;
				break;

			case 'Tab':
				hideList();
				break;

			default:
				inputElement.focus();
		}

		if (flag) {
			event.preventDefault();
			event.stopPropagation();
		}
	}

	async function showList(inputValue) {
		const isExactMatch = options.some((o) => o.text === inputValue);
		list = inputValue === '' || isExactMatch ? options : filter(inputValue);
		isListOpen = true;
	}

	function hideList() {
		if (!isListOpen) return;

		if (selectedOption) {
			inputElement.value = selectedOption.text;
		}

		isListOpen = false;
		inputElement.focus();
	}

	function selectOption(optionElement: HTMLOptionElement) {
		value = optionElement.dataset.value;

		selectedOption = {
			text: optionElement.dataset.text!,
			value: optionElement.dataset.value!
		};
		onSelectOption?.(selectedOption);
	}
</script>

<div class="combobox">
	<label class="combobox__label label" for={id}>
		{label}
		{#if error}
			<span class="form-validation-error">
				{error}
			</span>
		{/if}
	</label>

	<div class="input-container" use:onClickOutside={hideList}>
		<input
			bind:this={inputElement}
			onkeydown={onInputKeydown}
			onkeyup={onInputKeyup}
			{id}
			{name}
			type="text"
			{disabled}
			autocapitalize="none"
			autocomplete="off"
			{readonly}
			{placeholder}
			spellcheck="false"
			role="combobox"
			aria-controls="{id}-list"
			aria-autocomplete="list"
			aria-expanded={isListOpen}
			aria-required={required ? 'true' : undefined}
		/>

		<ul
			class="combobox__list"
			role="listbox"
			aria-label={label}
			hidden={!isListOpen}
			onclick={onOptionClick}
			onkeydown={onListKeyDown}
			id="{id}-list"
			bind:this={listElement}
		>
			{#each list as option (option)}
				<li
					class="list__option"
					class:disabled={option.disabled}
					role="option"
					tabindex={option.disabled === true ? null : -1}
					data-text={option.text}
					data-value={option.value}
					aria-selected={value === option.value}
					aria-disabled={option.disabled}
				>
					{option.text}
				</li>
			{:else}
				<li class="list__no-results">No results available</li>
			{/each}
		</ul>

		<div class="visually-hidden" role="status" aria-live="polite">
			{list.length} results available.
		</div>
	</div>
</div>

<style>
	.visually-hidden {
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		height: 1px;
		overflow: hidden;
		position: absolute;
		white-space: nowrap;
		width: 1px;
	}
	.combobox {
		--accent-color: #06113c;
		--background-color: white;
		--border-radius: 1em;

		--option-border: ;
		--option-padding: ;

		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	.input-container {
		position: relative;
	}

	input {
		margin: 0;
		width: 100%;
		padding: 0.8rem 1rem;
		border: 2px solid currentColor;
		border-radius: 1.5rem;
		font-family: 'OldNewspaperTypes';
		background: #fff;
		padding: 0.5rem 1rem;
		filter: url(#squiggle);
		font-size: 1.2rem;
	}

	input[aria-expanded='true'] {
		border-radius: 1.5rem 1.5rem 0 0;
		border-bottom: none;
	}

	input:hover {
		box-shadow: var(--subtle-shadow);
	}

	input:focus {
		outline: none;
	}

	.combobox:focus-within input {
		outline: none;
	}

	.combobox__list {
		/* Reset */
		list-style: none;
		margin: 0;
		margin-bottom: var(--grid-4);
		padding: 0.3rem;
		/* Position and Size */
		width: 100%;
		max-height: 20vh;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		filter: url(#squiggle);

		background-color: var(--background-color);
		border-radius: 0 0 1.5rem 1.5rem;
		border: 2px solid var(--accent-color);
		border-top: 2px dashed currentColor;
		box-shadow: var(--subtle-shadow);
	}

	.list__no-results {
		padding: 0.8rem 1rem;
	}

	.list__option {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.8rem 1rem;
		border: 0.2rem solid transparent;
		border-radius: 0.3rem;
	}

	.list__option > :global(*) {
		pointer-events: none;
	}

	.disabled {
		pointer-events: none;
		opacity: 0.4;
	}

	.list__option:focus,
	.list__option:not([aria-disabled='true']):hover {
		outline: none;
		cursor: pointer;
		background-color: rgba(0, 0, 0, 0.1);
	}

	.list__option:active {
		cursor: pointer;
		outline: none;
		color: white;
		background-color: var(--accent-color) !important;
	}
</style>
