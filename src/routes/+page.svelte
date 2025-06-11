<script lang="ts">
  import type { LandingData } from '$lib/types';
  import ItemGrid from '$lib/ItemGrid.svelte';

  type PageData = {
    landingData: LandingData;
  };

  let { data }: { data: PageData } = $props();
  const { landing } = data.landingData.stories;
  const { projects } = data.landingData.stories;
  const { articles } = data.landingData.stories;

</script>

<div class="page landing">

  <header class="page__header">
    <h1 class="title">{landing.content.title}</h1>
    <p class="lead">{landing.content.lead}</p>
  </header>
  
  <hr class="hr" />
  
  <section class="section projects">
    <h2 class="section__header">Afgeronde projecten</h2>
    <p class="section__text">
      Een kleine showcase van wat ik heb gedaan in het (recente) verleden.
    </p>
  
    <ItemGrid items={projects} />
  </section>
  
  <hr class="hr" />
  
  <section class="section articles">
    <h2 class="section__header">Artikelen</h2>
    <p class="section__text">
      Af en toe schrijf ik over technieken op het gebied van programmeren,
      OSINT en datajournalistiek.
    </p>
  
    <ItemGrid items={articles} />
  </section>
  
  <hr class="hr" />
  
  <section class="section contact">
    <p class="section__text">
      Benader me via
      <a
        class="link"
        target="_blank"
        href="https://www.linkedin.com/in/jorisheijkant/"
        >LinkedIn</a
      >
    </p>
  </section>
  
  <hr class="hr" />
  
  <p class="copyright-notice">© Joris Heijkant, 2025</p>
</div>
