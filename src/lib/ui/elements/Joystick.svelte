<script lang="ts">
	import { onMount } from 'svelte';

	import { joystickPosition, rotateX, jumpPressed } from '$lib/gamestate';

	let thumbDiv: HTMLDivElement;

	let startPosition: [number, number] | undefined = undefined;

	function joystickTouchstart(e: TouchEvent) {
		startPosition = [e.touches[0].clientX, e.touches[0].clientY];
		updateThumbPosition(0, 0);
	}

	function joystickTouchend(e: TouchEvent) {
		updateThumbPosition(0, 0);
	}

	function joystickTouchmove(e: TouchEvent) {
		if (startPosition) {
			let x = e.touches[0].clientX - startPosition[0];
			let y = e.touches[0].clientY - startPosition[1];

			updateThumbPosition(x, y);
		}
	}

	function updateThumbPosition(x: number, y: number) {
		let max = 100;
		if (thumbDiv) {
			if (x * x + y * y > max * max) {
				let angle = Math.atan2(y, x);
				x = Math.cos(angle) * max;
				y = Math.sin(angle) * max;
			}
			thumbDiv.style.transform = `translate(${x}px, ${y}px)`;

            $joystickPosition = [x / max, y / max];
		}
	}

	onMount(() => {
		// Reset the position of the inner div on mount
		if (thumbDiv) {
			thumbDiv.style.transform = 'translate(0px, 0px)';
		}
	});


	let touchX: number | undefined = undefined;
    let touchY: number | undefined = undefined;
	function touchstart(event: TouchEvent) {
		const { touches } = event;

		if (touches.length > 0) {
			touchX = touches[touches.length - 1].clientX;
            touchY = touches[touches.length - 1].clientY;
		}
	}

	function touchend(event: TouchEvent) {
        const { touches } = event;

		if (touches.length > 0 && touchX !== undefined && touchY !== undefined) {
            const deltaX = touches[touches.length - 1].clientX - touchX;
            const deltaY = touches[touches.length - 1].clientY - touchY;

            if(Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
                $jumpPressed = true;
            }
		}

		touchX = undefined;
        touchY = undefined;

        $rotateX = 0;
	}

	function touchmove(event: TouchEvent) {
		const { touches } = event;

		if (touches.length > 0 && touchX !== undefined) {
			let deltaX = touches[touches.length - 1].clientX - touchX;
            $rotateX = deltaX * 0.1;
		}
	}
</script>


<div class="fixed inset-0" 
on:touchstart|preventDefault={touchstart}
on:touchend|preventDefault={touchend}
on:touchcancel|preventDefault={touchend}
on:touchmove|preventDefault={touchmove}></div>

<div
	class="fixed left-0 bottom-0 w-full sm:w-64 h-64 bg-black/[1%] flex items-center justify-center rounded-tr-md"
	on:touchstart|preventDefault={joystickTouchstart}
	on:touchend|preventDefault={joystickTouchend}
	on:touchcancel|preventDefault={joystickTouchend}
	on:touchmove|preventDefault={joystickTouchmove}
>
	<div class="rounded-full w-20 h-20 bg-black/20" bind:this={thumbDiv}></div>
</div>