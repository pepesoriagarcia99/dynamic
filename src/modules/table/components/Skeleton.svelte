<script lang="ts">
	export let width: string = "100%";
	export let height: string = "16px";
	export let borderRadius: string = "4px";
</script>

<div class="skeleton" style="width: {width}; height: {height}; border-radius: {borderRadius};">
	<div class="skeleton-shimmer"></div>
</div>

<style>
	.skeleton {
		overflow: hidden;
		background-color: #f3f4f6;
		position: relative;
	}

	.skeleton-shimmer {
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			rgba(243, 244, 246, 0) 0%,
			rgba(229, 231, 235, 0.8) 50%,
			rgba(243, 244, 246, 0) 100%
		);
		animation: shimmer 1.5s infinite;
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
</style>
