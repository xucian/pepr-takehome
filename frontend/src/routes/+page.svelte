<script lang="ts">
	import { env } from '$env/dynamic/public';
	import InstagramStory from '$lib/components/InstagramStory.svelte';
	import type { AdData } from '$lib/types.js';

	let htmlInput = $state('');
	let adData = $state<AdData | null>(null);
	let isLoading = $state(false);
	let error = $state('');

	const API_URL = env.PUBLIC_API_URL || 'http://localhost:3002';

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
				const errorData = await response.json();
				throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
			}

			adData = await response.json();
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
						<li>Search for any advertiser (e.g., "Nike", "Spotify")</li>
						<li>Filter by <strong>Instagram</strong> platform</li>
						<li>Right-click on an ad → "Inspect"</li>
						<li>Right-click the HTML element → "Copy element"</li>
						<li>Paste above and click "Parse & Preview"</li>
					</ol>
				</div>

				<div class="api-docs">
					<h3>API Documentation</h3>
					<div class="api-section">
						<h4>POST /api/parse-ad</h4>
						<p>Parse Meta Ad Library HTML and extract structured ad data.</p>

						<h5>Request:</h5>
						<pre><code>POST {API_URL}/api/parse-ad
Content-Type: application/json

{'{'}
  "html": "&lt;div class=\"xh8yej3\"&gt;...&lt;/div&gt;"
{'}'}</code></pre>

						<h5>Response (200 OK):</h5>
						<pre><code>{JSON.stringify({
  advertiser: {
    name: "Nike",
    profileImage: "https://...",
    pageUrl: "https://facebook.com/nike"
  },
  creative: {
    mediaType: "image",
    mediaUrl: "https://...",
    text: "Their game goes beyond...",
    cta: "Shop Now"
  },
  metadata: {
    platform: "instagram",
    format: "story",
    destinationUrl: "https://..."
  }
}, null, 2)}</code></pre>

						<h5>Response (400/500 Error):</h5>
						<pre><code>{JSON.stringify({
  error: "No media content found in HTML"
}, null, 2)}</code></pre>

						<h5>Parameters:</h5>
						<table>
							<thead>
								<tr>
									<th>Field</th>
									<th>Type</th>
									<th>Required</th>
									<th>Description</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td><code>html</code></td>
									<td>string</td>
									<td>✓</td>
									<td>Meta Ad Library HTML content</td>
								</tr>
							</tbody>
						</table>
					</div>
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

	.api-docs {
		margin-top: 24px;
		padding: 20px;
		background: #f9f9f9;
		border-radius: 8px;
		border-left: 4px solid #764ba2;
	}

	.api-docs h3 {
		margin: 0 0 16px 0;
		font-size: 1rem;
		font-weight: 600;
	}

	.api-docs h4 {
		margin: 16px 0 8px 0;
		font-size: 1rem;
		font-weight: 600;
		color: #667eea;
		font-family: 'Courier New', monospace;
	}

	.api-docs h5 {
		margin: 16px 0 8px 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: #555;
	}

	.api-docs p {
		margin: 0 0 12px 0;
		font-size: 14px;
		color: #666;
	}

	.api-docs pre {
		background: #1e1e1e;
		color: #d4d4d4;
		padding: 16px;
		border-radius: 6px;
		overflow-x: auto;
		font-size: 13px;
		line-height: 1.5;
		margin: 8px 0 16px 0;
	}

	.api-docs code {
		font-family: 'Courier New', monospace;
	}

	.api-docs table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 8px;
		font-size: 13px;
	}

	.api-docs th {
		background: #667eea;
		color: white;
		padding: 10px;
		text-align: left;
		font-weight: 600;
	}

	.api-docs td {
		padding: 10px;
		border: 1px solid #ddd;
		background: white;
	}

	.api-docs td code {
		background: #f0f0f0;
		padding: 2px 6px;
		border-radius: 3px;
		color: #c7254e;
	}

	.story-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 600px;
	}
</style>
