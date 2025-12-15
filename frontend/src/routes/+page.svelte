<script lang="ts">
	import { env } from '$env/dynamic/public';
	import InstagramStory from '$lib/components/InstagramStory.svelte';
	import type { AdData, ParseAdResponse } from '$lib/types.js';

	let htmlInput = $state('');
	let adData = $state<AdData | null>(null);
	let isLoading = $state(false);
	let error = $state('');

	const API_URL = env.PUBLIC_API_URL || 'http://localhost:3000';

	async function parseAd() {
		if (!htmlInput.trim()) {
			error = 'Please paste HTML content';
			return;
		}

		isLoading = true;
		error = '';
		adData = null;

		try {
			const response = await fetch(`${API_URL}/api/parse-ad`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ html: htmlInput }),
			});

			if (!response.ok) {
				const result: ParseAdResponse = await response.json();
				throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
			}

			const result: ParseAdResponse = await response.json();

			if (result.success && result.data) {
				adData = result.data;
			} else {
				error = result.error || 'Failed to parse ad';
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Network error occurred';
		} finally {
			isLoading = false;
		}
	}

	function clearForm() {
		htmlInput = '';
		adData = null;
		error = '';
	}
</script>

<svelte:head>
	<title>Instagram Mirror - Meta Ad Library Parser</title>
</svelte:head>

<main>
	<div class="container">
		<header>
			<h1>Instagram Mirror</h1>
			<p>Parse Meta Ad Library HTML and preview as Instagram Story</p>
		</header>

		<div class="content">
			<div class="input-section">
				<h2>Paste Ad HTML</h2>
				<textarea
					bind:value={htmlInput}
					placeholder="Paste Meta Ad Library HTML here..."
					rows="10"
				></textarea>

				<div class="button-group">
					<button onclick={parseAd} disabled={isLoading || !htmlInput.trim()} class="primary">
						{isLoading ? 'Parsing...' : 'Parse & Preview'}
					</button>
					<button onclick={clearForm} disabled={isLoading} class="secondary">
						Clear
					</button>
				</div>

				{#if error}
					<div class="error-message">
						<strong>Error:</strong> {error}
					</div>
				{/if}

				<div class="instructions">
					<h3>Instructions:</h3>
					<ol>
						<li>Visit <a href="https://www.facebook.com/ads/library/" target="_blank" rel="noopener">Meta Ad Library</a></li>
						<li>Search for an advertiser or ad</li>
						<li>Right-click on the ad card and select "Inspect"</li>
						<li>Copy the HTML of the ad element</li>
						<li>Paste it above and click "Parse & Preview"</li>
					</ol>
				</div>
			</div>

			<div class="preview-section">
				<h2>Instagram Story Preview</h2>
				<div class="story-wrapper">
					<InstagramStory {adData} />
				</div>
			</div>
		</div>
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
		background: #fafafa;
		color: #262626;
	}

	main {
		min-height: 100vh;
		padding: 20px;
	}

	.container {
		max-width: 1400px;
		margin: 0 auto;
	}

	header {
		text-align: center;
		margin-bottom: 40px;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 700;
		margin: 0 0 8px 0;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	header p {
		color: #8e8e8e;
		font-size: 1.1rem;
		margin: 0;
	}

	.content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 40px;
		align-items: start;
	}

	@media (max-width: 968px) {
		.content {
			grid-template-columns: 1fr;
		}
	}

	.input-section,
	.preview-section {
		background: #fff;
		border-radius: 12px;
		padding: 24px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	h2 {
		margin: 0 0 16px 0;
		font-size: 1.5rem;
		font-weight: 600;
	}

	textarea {
		width: 100%;
		padding: 12px;
		border: 2px solid #dbdbdb;
		border-radius: 8px;
		font-family: 'Courier New', monospace;
		font-size: 13px;
		resize: vertical;
		min-height: 200px;
		box-sizing: border-box;
	}

	textarea:focus {
		outline: none;
		border-color: #667eea;
	}

	.button-group {
		display: flex;
		gap: 12px;
		margin-top: 16px;
	}

	button {
		padding: 12px 24px;
		border: none;
		border-radius: 8px;
		font-weight: 600;
		font-size: 14px;
		cursor: pointer;
		transition: all 0.2s;
		flex: 1;
	}

	button.primary {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: #fff;
	}

	button.primary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
	}

	button.secondary {
		background: #f5f5f5;
		color: #262626;
	}

	button.secondary:hover:not(:disabled) {
		background: #e0e0e0;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	button:active:not(:disabled) {
		transform: translateY(0);
	}

	.error-message {
		margin-top: 16px;
		padding: 12px;
		background: #fee;
		border: 1px solid #fcc;
		border-radius: 8px;
		color: #c00;
		font-size: 14px;
	}

	.instructions {
		margin-top: 24px;
		padding: 16px;
		background: #f9f9f9;
		border-radius: 8px;
		border-left: 4px solid #667eea;
	}

	.instructions h3 {
		margin: 0 0 12px 0;
		font-size: 1rem;
		font-weight: 600;
	}

	.instructions ol {
		margin: 0;
		padding-left: 20px;
	}

	.instructions li {
		margin-bottom: 8px;
		font-size: 14px;
		line-height: 1.5;
	}

	.instructions a {
		color: #667eea;
		text-decoration: none;
	}

	.instructions a:hover {
		text-decoration: underline;
	}

	.story-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 600px;
	}
</style>
