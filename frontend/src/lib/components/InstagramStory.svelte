<script lang="ts">
	import type { AdData } from '../types.js';

	let { adData } = $props<{ adData: AdData | null }>();
	let isMuted = $state(false);
	let videoElement: HTMLVideoElement | null = $state(null);

	function toggleMute() {
		isMuted = !isMuted;
		if (videoElement) {
			videoElement.muted = isMuted;
		}
	}

	function handleVideoLoad(element: HTMLVideoElement) {
		videoElement = element;
		// Try to play with sound, fall back to muted if blocked by browser
		element.muted = false;
		element.play().catch(() => {
			// Browser blocked autoplay with sound, start muted
			element.muted = true;
			isMuted = true;
			element.play();
		});
	}
</script>

{#if adData}
	<div class="story-container">
		<!-- Header with advertiser info -->
		{#if adData.advertiser.pageUrl}
			<a href={adData.advertiser.pageUrl} target="_blank" rel="noopener noreferrer" class="story-header">
				{#if adData.advertiser.profileImage}
					<img
						src={adData.advertiser.profileImage}
						alt={adData.advertiser.name}
						class="profile-image"
					/>
				{:else}
					<div class="profile-placeholder">
						{adData.advertiser.name.charAt(0).toUpperCase()}
					</div>
				{/if}
				<div class="advertiser-info">
					<span class="advertiser-name">{adData.advertiser.name}</span>
					<span class="sponsored-label">Sponsored</span>
				</div>
			</a>
		{:else}
			<div class="story-header">
				{#if adData.advertiser.profileImage}
					<img
						src={adData.advertiser.profileImage}
						alt={adData.advertiser.name}
						class="profile-image"
					/>
				{:else}
					<div class="profile-placeholder">
						{adData.advertiser.name.charAt(0).toUpperCase()}
					</div>
				{/if}
				<div class="advertiser-info">
					<span class="advertiser-name">{adData.advertiser.name}</span>
					<span class="sponsored-label">Sponsored</span>
				</div>
			</div>
		{/if}

		<!-- Mute/Unmute button (top-right, only for video) -->
		{#if adData.creative.mediaType === 'video'}
			<button class="mute-button" onclick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
				{#if isMuted}
					<!-- Muted speaker icon -->
					<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M24 6L14 16H6V32H14L24 42V6Z" fill="white"/>
						<line x1="30" y1="18" x2="42" y2="30" stroke="white" stroke-width="3" stroke-linecap="round"/>
						<line x1="42" y1="18" x2="30" y2="30" stroke="white" stroke-width="3" stroke-linecap="round"/>
					</svg>
				{:else}
					<!-- Unmuted speaker icon -->
					<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M24 6L14 16H6V32H14L24 42V6Z" fill="white"/>
						<path d="M32 16C34.5 18.5 36 21.5 36 24C36 26.5 34.5 29.5 32 32" stroke="white" stroke-width="3" stroke-linecap="round"/>
						<path d="M36 10C40 14 42 19 42 24C42 29 40 34 36 38" stroke="white" stroke-width="3" stroke-linecap="round"/>
					</svg>
				{/if}
			</button>
		{/if}

		<!-- Media content -->
		<div class="story-media">
			{#if adData.creative.mediaType === 'video'}
				<video
					use:handleVideoLoad
					src={adData.creative.mediaUrl}
					loop
					playsinline
				>
					<track kind="captions" />
				</video>
			{:else}
				<img src={adData.creative.mediaUrl} alt="Ad creative" />
			{/if}
		</div>

		<!-- Footer with text and CTA -->
		{#if adData.creative.text || adData.creative.cta}
			<div class="story-footer">
				{#if adData.creative.text}
					<p class="ad-text">{adData.creative.text}</p>
				{/if}
				{#if adData.creative.cta && adData.metadata.destinationUrl}
					<a href={adData.metadata.destinationUrl} target="_blank" rel="noopener noreferrer" class="cta-link">
						<button class="cta-button">{adData.creative.cta}</button>
					</a>
				{:else if adData.creative.cta}
					<button class="cta-button">{adData.creative.cta}</button>
				{/if}
			</div>
		{/if}
	</div>
{:else}
	<div class="story-container empty">
		<p>No ad data to display</p>
	</div>
{/if}

<style>
	.story-container {
		width: 100%;
		max-width: 400px;
		aspect-ratio: 9 / 16;
		background: linear-gradient(180deg, #1a1a1a 0%, #000000 100%);
		border-radius: 12px;
		overflow: hidden;
		position: relative;
		display: flex;
		flex-direction: column;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
	}

	.story-container.empty {
		justify-content: center;
		align-items: center;
		color: #888;
	}

	.story-header {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		padding: 16px;
		display: flex;
		align-items: center;
		gap: 12px;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, transparent 100%);
		z-index: 10;
		text-decoration: none;
		color: inherit;
		transition: opacity 0.2s;
	}

	a.story-header:hover {
		opacity: 0.9;
	}

	.mute-button {
		position: absolute;
		top: 16px;
		right: 16px;
		width: 40px;
		height: 40px;
		background: transparent;
		border: none;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		z-index: 20;
		transition: transform 0.2s;
		padding: 0;
	}

	.mute-button:hover {
		transform: scale(1.1);
	}

	.mute-button:active {
		transform: scale(0.95);
	}

	.mute-button svg {
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
	}

	.profile-image {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 2px solid #fff;
		object-fit: cover;
	}

	.profile-placeholder {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 2px solid #fff;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-weight: 600;
		font-size: 18px;
	}

	.advertiser-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.advertiser-name {
		color: #fff;
		font-weight: 600;
		font-size: 14px;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
	}

	.sponsored-label {
		color: rgba(255, 255, 255, 0.8);
		font-size: 12px;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
	}

	.story-media {
		flex: 1;
		width: 100%;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #000;
	}

	.story-media img,
	.story-media video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Video shouldn't cover overlays */
	.story-media video {
		position: relative;
	}

	.story-footer {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 20px 16px;
		background: linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
		z-index: 10;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.ad-text {
		color: #fff;
		font-size: 14px;
		line-height: 1.4;
		margin: 0;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
		white-space: pre-wrap;
	}

	.cta-link {
		text-decoration: none;
		width: 100%;
		display: block;
	}

	.cta-button {
		background: #fff;
		color: #000;
		border: none;
		border-radius: 8px;
		padding: 12px 24px;
		font-weight: 600;
		font-size: 14px;
		cursor: pointer;
		transition: transform 0.2s, opacity 0.2s;
		width: 100%;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.cta-button:hover {
		transform: scale(1.02);
		opacity: 0.9;
	}

	.cta-button:active {
		transform: scale(0.98);
	}
</style>
