<script lang="ts">
	import type { AdData } from '../types.js';

	let { adData } = $props<{ adData: AdData | null }>();
</script>

{#if adData}
	<div class="story-container">
		<!-- Header with advertiser info -->
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

		<!-- Media content -->
		<div class="story-media">
			{#if adData.creative.mediaType === 'video'}
				<video src={adData.creative.mediaUrl} controls autoplay muted loop>
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
				{#if adData.creative.cta}
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
