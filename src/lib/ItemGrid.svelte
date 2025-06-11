<script lang="ts">
  export let items;

  interface Image {
    filename: String,
    id: String
  }

  const getImageExtension = (image: Image) => {
    if (!image) return;
    const filename = image.filename;
    return filename.split(".").pop();
  };

  const getLocalImageUrl = (image: Image) => {
    if (!image.id) return;

    const imageExtension = getImageExtension(image);

    return `/media/${image.id}.${imageExtension}`;
  };
</script>

<div class="item-grid">
  {#each items as item}
    <a
      href="{item.content.link.url}"
      target="_blank"
      class="item-teaser"
    >
      {#if item.content.image}
        <img
          class="item-teaser__image"
          src="{getLocalImageUrl(item.content.image)}"
          alt="{item.content.title}"
        />
      {/if}
      <div class="item-teaser__content">
        <h3 class="item-teaser__title">{ item.content.title }</h3>
        <p class="item-teaser__description">{ item.content.description }</p>
      </div>
    </a>
  {/each}
</div>

<style>
	/* styles go here */
</style>