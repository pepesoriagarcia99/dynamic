<script lang="ts">
    interface SkeletonProps {
        width?: string;
        height?: string;
        borderRadius?: string;
    }

    const { width = "100%", height = "16px", borderRadius = "4px" }: SkeletonProps = $props();
</script>

<div 
    class="skeleton" 
    style:width={width}
    style:height={height}
    style:border-radius={borderRadius}
></div>

<style>
    .skeleton {
        overflow: hidden;
        background-color: #f3f4f6;
        position: relative;
        contain: layout paint style;
    }

    .skeleton::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            rgba(243, 244, 246, 0) 0%,
            rgba(229, 231, 235, 0.8) 50%,
            rgba(243, 244, 246, 0) 100%
        );
        animation: shimmer 1.5s infinite;
        will-change: transform;
    }

    @keyframes shimmer {
        0% {
            transform: translate3d(-100%, 0, 0);
        }
        100% {
            transform: translate3d(100%, 0, 0);
        }
    }
</style>