<template>
  <div>
    <HexBackground />

    <div class="relative min-h-screen overflow-x-hidden" style="z-index: 1">
      <header class="pt-8 px-6">
        <router-link to="/" class="font-display text-xl font-black text-gradient-wine tracking-tight no-underline">
          RELL
        </router-link>
      </header>

      <main class="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-6 text-center">
        <h1 ref="heroTitle" class="font-display text-7xl md:text-9xl font-black tracking-tighter text-gradient-wine mb-4">
          RELL
        </h1>
        <p ref="heroSub" class="font-display text-lg md:text-xl text-secondary tracking-[0.3em] uppercase mb-10">
          FFmpeg — editor de vídeo e imagem
        </p>
        <button ref="heroCta" @click="goToEditor"
          class="rounded-xl px-8 py-3 bg-gradient-to-r from-wine-500 to-gold-600 font-display text-sm font-bold text-primary tracking-wider uppercase hover:glow-wine transition-all duration-300 active:scale-[0.97]">
          Começar a editar
        </button>
      </main>

      <div ref="scrollIndicator" class="pb-8 flex flex-col items-center gap-2">
        <span class="font-mono text-xs text-muted uppercase tracking-widest">Scroll</span>
        <div class="w-[1px] h-10 bg-gradient-to-b from-wine-500 to-transparent animate-pulse" />
      </div>
    </div>

    <section ref="featuresSection" class="relative px-6 py-24 border-t border-wine-700/30" style="z-index: 1; background: #0a0a12">
      <div class="max-w-6xl mx-auto">
        <h2 ref="featuresTitle" class="font-display text-3xl md:text-4xl font-bold text-primary text-center mb-16">
          O que o <span class="text-gradient-wine">Rell FFmpeg</span> faz
        </h2>

        <!-- Video example -->
        <div ref="videoExample" class="mb-20">
          <h3 class="font-display text-xl font-bold text-primary mb-6 text-center">
            <span class="text-wine-300 mr-2">&#9654;</span> Efeito Preto e Branco em Vídeo
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-elevated border border-wine-700/30 rounded-2xl p-6 text-center">
              <div ref="videoBefore" class="aspect-video bg-deep rounded-lg flex items-center justify-center mb-3 relative overflow-hidden group">
                <svg ref="playBefore" class="w-16 h-16 text-wine-500/60 group-hover:text-wine-300 transition-colors duration-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span class="absolute top-2 left-2 font-mono text-[10px] text-muted uppercase tracking-wider bg-deep/70 px-2 py-1 rounded">Original</span>
              </div>
              <p class="font-mono text-xs text-secondary">Antes — vídeo original</p>
            </div>
            <div class="bg-elevated border border-wine-700/30 rounded-2xl p-6 text-center">
              <div ref="videoAfter" class="aspect-video bg-deep rounded-lg flex items-center justify-center mb-3 relative overflow-hidden group">
                <svg class="w-16 h-16 text-gold-500/60" viewBox="0 0 24 24" fill="currentColor" style="color: #8c6a2a">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span class="absolute top-2 left-2 font-mono text-[10px] text-muted uppercase tracking-wider bg-deep/70 px-2 py-1 rounded">Processado</span>
              </div>
              <p class="font-mono text-xs text-secondary">Depois — preto e branco</p>
            </div>
          </div>
        </div>

        <!-- Image example -->
        <div ref="imageExample" class="mb-24">
          <h3 class="font-display text-xl font-bold text-primary mb-6 text-center">
            <span class="text-wine-300 mr-2">&#9632;</span> Efeito Sépia em Imagem
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-elevated border border-wine-700/30 rounded-2xl p-6 text-center">
              <div ref="imgBefore" class="aspect-[4/3] bg-deep rounded-lg flex items-center justify-center mb-3 relative overflow-hidden">
                <svg class="w-16 h-16 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
                <span class="absolute top-2 left-2 font-mono text-[10px] text-muted uppercase tracking-wider bg-deep/70 px-2 py-1 rounded">Original</span>
              </div>
              <p class="font-mono text-xs text-secondary">Antes — imagem original</p>
            </div>
            <div class="bg-elevated border border-wine-700/30 rounded-2xl p-6 text-center">
              <div ref="imgAfter" class="aspect-[4/3] bg-deep rounded-lg flex items-center justify-center mb-3 relative overflow-hidden">
                <svg class="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="#c9a03c" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke="#c9a03c"/>
                  <path d="M21 15l-5-5L5 21" stroke="#c9a03c"/>
                </svg>
                <span class="absolute top-2 left-2 font-mono text-[10px] text-muted uppercase tracking-wider bg-deep/70 px-2 py-1 rounded">Processado</span>
              </div>
              <p class="font-mono text-xs text-secondary">Depois — sépia</p>
            </div>
          </div>
        </div>

        <!-- Feature cards -->
        <h2 ref="cardsTitle" class="font-display text-2xl md:text-3xl font-bold text-primary text-center mb-12">
          Ferramentas
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div v-for="(card, i) in cards" :key="i" ref="cardsRefs"
            class="bg-elevated border border-wine-700/30 rounded-2xl p-8 hover:border-wine-500/60 hover:glow-wine transition-all duration-500 cursor-pointer text-center"
            @click="goToEditor">
            <div class="font-display text-4xl mb-4">{{ card.icon }}</div>
            <h3 class="font-display text-lg font-bold text-primary mb-3">{{ card.title }}</h3>
            <p class="font-display text-secondary text-sm leading-relaxed">{{ card.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Base, Component as Register, toNative } from 'vue-facing-decorator';
import HexBackground from '@/components/hero/HexBackground.vue';

class HeroPage extends Base {
  cards = [
    { icon: '🎬', title: 'Edite vídeos', desc: 'Corte, acelere, inverta, aplique filtros. Tudo no navegador.' },
    { icon: '🖼️', title: 'Edite imagens', desc: 'Filtros, redimensionamento, corte. Sem upload para servidor.' },
    { icon: '🎵', title: 'Extraia áudio', desc: 'Extraia o áudio dos seus vídeos em MP3 ou WAV.' },
  ];

  mounted() {
    this.initAnimations();
  }

  private async initAnimations() {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    gsap.registerPlugin(ScrollTrigger);

    const heroTitle = this.$refs.heroTitle as HTMLElement;
    const heroSub = this.$refs.heroSub as HTMLElement;
    const heroCta = this.$refs.heroCta as HTMLElement;
    const featuresSection = this.$refs.featuresSection as HTMLElement;
    const featuresTitle = this.$refs.featuresTitle as HTMLElement;
    const videoExample = this.$refs.videoExample as HTMLElement;
    const imageExample = this.$refs.imageExample as HTMLElement;
    const cardsTitle = this.$refs.cardsTitle as HTMLElement;
    const cardsRefs = this.$refs.cardsRefs as HTMLElement[];
    const playBefore = this.$refs.playBefore as HTMLElement;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
      heroTl.from(heroTitle, { y: 40, opacity: 0 }, 0)
        .from(heroSub, { y: 30, opacity: 0 }, 0.15)
        .from(heroCta, { y: 20, opacity: 0 }, 0.3);

      // Play icon pulse
      if (playBefore) {
        gsap.to(playBefore, {
          scale: 1.15,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        });
      }

      ScrollTrigger.create({
        trigger: featuresSection,
        start: 'top bottom',
        toggleActions: 'play none none none',
        onEnter: () => {
          const sectionTl = gsap.timeline({ defaults: { duration: 0.7, ease: 'power3.out', clearProps: 'y' } });
          sectionTl.from(featuresTitle, { y: 40 })
            .from(videoExample, { y: 50 }, 0.15)
            .from(imageExample, { y: 50 }, 0.25)
            .from(cardsTitle, { y: 40 }, 0.35)
            .from(cardsRefs, { y: 60, stagger: 0 }, 0.4);
        },
      });
    });
  }

  goToEditor() {
    this.$router.push('/editor');
  }
}

Register(HeroPage);
const Page = toNative(HeroPage);
Page.components = { HexBackground };
export default Page;
</script>
