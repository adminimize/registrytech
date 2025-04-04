<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';

	let { children } = $props();

	// Handle view transitions
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<div class="min-h-screen bg-[#1B1919] text-[#F6F6F6] font-['Inter']">
	<div class="max-w-[777px] w-[80vw] mx-auto px-5 py-8">
		<slot />
	</div>
</div>

<style>
	/* View Transitions */
	@keyframes fade-in { from { opacity: 0; } }
	@keyframes fade-out { to { opacity: 0; } }
	@keyframes slide-from-right { from { transform: translateX(30px); } }
	@keyframes slide-to-left { to { transform: translateX(-30px); } }

	:global(:root::view-transition-old(root)) {
		animation: 90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
					300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
	}

	:global(:root::view-transition-new(root)) {
		animation: 210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
					300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
	}

	:global(html) {
		background-color: #1B1919;
	}

	:global(body) {
		margin: 0;
		min-height: 100dvh;
	}
</style>
