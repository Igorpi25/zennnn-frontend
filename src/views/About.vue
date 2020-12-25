<template>
  <div>
    <div class="flex flex-col min-h-screen">
      <!-- / HEADER -->
      <header class="pt-6 pb-4 font-medium">
        <div class="container container--xs">
          <div class="flex items-center h-13">
            <router-link
              :to="{ name: 'home' }"
              class="h-6 mr-16"
            >
              <img src="@/assets/img/logo-light.svg" alt="Logo">
            </router-link>
            <nav class="hidden md:flex items-center leading-5 text-light-gray-700">
              <a
                v-for="(item, i) of navItems"
                :key="i"
                :class="{ 'text-blue-700': activeNav === i }"
                href="#"
                class="mx-5 hover:text-blue-700 transition-colors duration-100 ease-out"
                @click.prevent="goTo(i)"
              >
                {{ item.text }}
              </a>
            </nav>
            <router-link
              :to="{ name: 'signup' }"
              class="hidden lg:inline-flex items-center text-blue-700 px-6 ml-auto h-13 rounded-50 shadow-outline select-none focus:outline-none focus:text-blue-800 hover:text-blue-800"
            >
              Получить пробный период
            </router-link>
          </div>
        </div>
      </header>
      <!-- HEADER / -->
      <transition name="scale-transition" @leave="el => { el.style.display = 'none' }">
        <div
          v-if="isInfoAlertActive"
          :style="infoAlertStyle"
          class="about-info-alert z-10 fixed inset-x-0 top-0"
        >
          <div class="container container--xs about-info-alert__container">
            <div class="relative">
              <div class="about-info-alert__content absolute right-0 w-full flex items-center rounded-md px-4 py-3">
                <img src="@/assets/img/info.svg" alt="info" class="flex-shrink-0 self-start mr-4">
                <div
                  v-html="'ZENNNN — самый удобный сервис для удаленной работы с&nbsp;поставщиками со&nbsp;всего мира.'"
                  class="flex-grow font-semibold leading-5 text-center"
                />
                <div
                  class="flex-shrink-0 self-start text-gray-900 hover:text-black ml-4 w-5 h-5 flex items-center justify-center"
                  @click="isInfoAlertActive = false"
                >
                  <svg class="cursor-pointer" width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.46451 0.657227L9.94979 9.14251L8.53557 10.5567L0.0502933 2.07144L1.46451 0.657227Z" fill="currentColor"/>
                    <path d="M9.94979 2.07144L1.46451 10.5567L0.050293 9.14251L8.53557 0.657227L9.94979 2.07144Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <!-- / HERO -->
      <div class="md:relative flex-grow flex items-end pb-3">
        <div class="w-full md:pt-12">
          <div class="container container--xs">
            <div class="pt-32 md:pt-6">
              <div class="flex">
                <h1 class="about-head-title font-bold flex-shrink-0 mt-sm mb-5">бэк-офис ZENNNN</h1>
                <div class="w-full pb-5">
                  <div class="relative h-full md:static">
                    <div class="about-saas absolute left-0 md:top-0 md:right-0 bottom-0 md:bottom-auto md:right-auto md:pt-10 pl-3 md:pl-5">
                      <img
                        src="@/assets/img/saas.svg"
                        alt="SaaS"
                        class="w-full h-full"
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h2 class="about-head-subtitle font-bold pb-10 mb-1">
              Пер&shy;вый.<br>Муль&shy;ти&shy;я&shy;зыч&shy;ный.<br>Мощ&shy;ный.
            </h2>
          </div>
          <div class="about-devices block relative md:absolute">
            <div class="absolute right-0" style="bottom: 85px; left: 105px;">
              <Image
                :src="$breakpoint.width > 1440 ? '/static/img/main-deals_lg.png' : '/static/img/main-deals.png'"
                alt="deals"
                lazy-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAARCAYAAADdRIy+AAAACXBIWXMAABCcAAAQnAEmzTo0AAACuklEQVQ4y12Ty3bTQAyG8yBx0sR3j+3x3U5aaOmitKVLOCxgy4F34Bze215I/FIcJ7DQ0Yxm9I0uo5XjONN2u52CIJhCSHAlvu/P2pvyPJ+6rp+yLJvSNJ2MMcvaZnbK0mzabDbTCkB2b3ZskoQTYxgXIBnntuQ0s2ywz3LLcOa6rrkoCq6qSrWItRb2Ss8B5JWzdsj19pTnGaVZTmXVUFnWVDcDFWVFtiipaXuytoC9JEAIQNVFUam9aRr45wQgrdZrhz3X4eNx4JfXN0RTcFnVXLcDdMMAct20SzQi5wjlDEAGkAGcI0TK+92GD4eBn54+chwngOZ6OY5jLUHddCiBXYAX+ElXZXmVMoA3qKGAXHfPYRgwGsFxFCnQmGSuK2qZpdgbhUhEZq65PJCgB1fAG32h6QZG3eCQ6x51hc41EtkXZQ3bCSaQZi5F27YKv6S83+PA8v3jM7+//8B93zEacIpkTk0hVbukLeddf+C26/h4e6fgfyKUS3EcMf4exwg/QsryqqQiqcs+DEOVa9v5+yxNWa/X7HmeAiUt6aDURR6SC2d9XosIqJwbIbBzQ+RsibBAVwUmDZHLEoVEKy+LTUScMU1qF4g8LPdkLT4LEKOHrgaYlghfaAtnTyfn1PVQAZKFAAQsaymHSY1GG5mYE2suKe9dlz99/sXffvzm7z//8MPzV667W35++8JZmgAaqeM5UlkPw4Dm9ZrVgCYObYMIT02h3W5H3fGR7h5eIK/U9O8whhYjd6AkiQkNIEBUEDEhYh01EaRLViRJTqMnQNSQwsAnz91RCCffcylODCEa6JSKasDaX8Bil1kWoMD9ALYwou1mS0tTjEl1WkxqNcXEZNgbraHUS7TWCyL/VurqolTiK4Isl384wjACOAI04vXR94NZ+6qRlmpARwBHOI6o/Si+/8tf9P378y8MWXEAAAAASUVORK5CYII="
                class="w-full h-full"
                position="left top"
                width="581"
                height="452"
              />
            </div>
            <div class="absolute right-0 bottom-0" style="left: 33px;">
              <Image
                src="/static/img/ipad.png"
                alt="ipad"
                lazy-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAfCAYAAACVgY94AAAACXBIWXMAABCcAAAQnAEmzTo0AAAFqklEQVRYw82Ya0wUVxTH7x2YWR4rKPtABQQFy/JSQRCVqrCyLMvuAoL45CFF1sZtxeKCAoI8oqZpo1aoKFZ8gN3lVaum8rA1sZ+aNmk/NFHDWtNGP/RL22ibmljI9Ny7s7OLaU3aD7tM8s+Ze3buOb85d+6duYtOnjqFAgICGATH6+vWmWNjY3+Pj49/npiY+CIpKekvlUr1B/iexsaqnsWqVM9U/1FxcXGC4gXFzZBKRaR6SnJA3mc5OTlVhAV8DM/zCJWXl2PigIY/XPSY4ziLj4+PimGYVRjjVGinSSSSNGL/j1iWfaU4johbDeexkKcxOibmEQWD40z3WYRKS8so4ODQcEhCQsJjlvVNRV46pFJpxuLFix8CIEfabe3tCBmN+RTwY6tNGhMTY4fhVpO2QqHwBTGekFwuZ0lOyK0VAGm7vaMDIb1eTwGv9PVLo6OjJ+GiTNKGToynKufMBbk1APiDE/BIaxsBNFDAvv6rBNDuTcDAwABNVFSUCNjc3IKQwWAUhzjaMcSzpoKtbfQZdABabQOOZ9Dff9YAzpgktoHBWQd4pLV19gFGuQMeIYD5DsCBQQegvxcBAwNemiQtLa4KDg2PSJcsWeJdwMDAGYBNTYddFbTZYKFeulScxWQB9TZgQ2OTq4KDQ0N0HZxNFWxobHQHHJ51Q9zQ0PjSQu2lCspkMnEWR0ZGioAHDzUglCe8i8mrjlbQzy/TvZOnARctWiQC1tcfREin01HAS5evSGGRtPt5ATAkJITmgtHTRES4AC11dQhptVoK+NGFXimMv91PIsl07+SJY968eQKgnyY8PEIErK09gFC2RkMBu8+ek8L42yUCoLOTJ465c+fSXDB6mrCwMBFwX00NQuqNGylgZ9eHUiivHT6/M907eRIQiqNZuHChCLjXbEYoS62mgKc7uwAwws6xLAUMDg72GKAzFwFcsGCBCGjaswehzKwsAbBTGh4ePgmbF/rJHxQUxIIYD4l1AHLa+fPni5/8VburEVq/fgMFPHrs+JywsHA7y3Lp3to0QQUzQkNDHzk3TbsqKxHKyFhLf5x8+GMAlPcBbDlrYDa9BncDW042RcJxKcRSsWwK7PrcrC+17vpnn6sfFecS5CFKhc+8GBg9i1KpvA+AdMirq3fD3vN8n4/zDlLT0i8olaF8SIjsT5lM/kKUXP5CLlfMlMLNilIKPuVMv/v1gkhMEjtEJqMWVo3nCoWSX5W+pkvAwT29Vtc8uNg/Uv/m23W/pq/NnFqekj61YuXq6WXJq6aJTVqRNp24PHU6CZSwbCWcr5yOT0qm53GJyXCeQhWXuELwEev0JdO+TusUiQ15IP4aatNWr5tan6WdMtcc+qW3b7heBOs+f1Xb2X35/rmLA3xLx/u8yWzhi7aU8ZtKSvnirRV8ftF2vnDzTtrOyy/hdcbNvL5gC7VEuYZiUVp9kePcaUHkGo2ukDdu2kZj5RlL+MJiEq+MLyjewZdsr6T5dpSb+BpLM9969ATfAyynuy/d6+m1qVGN5fDxiqq9E8Vby22gIbh4xFCw5Vquoeg66KYmN/+zHF3BrZy8wlF1jmFUrdGPZWuNY2qNYVzQRFa2fgL8E1lE2XkTDp/Dgn98w0bdOMSBfvljJIYmt2AU4t0iseFmbuqMxddJTijCCGHYvK3CWlFl/ny/5XDLqyYVmd2+ZHKRRZ68y8kXEfmHAjSHrERkCSPr7CsULChI6CMVYgQIMTkhB/5Xij7bDebhk6f4u/tP8N2v7uFbd77B/cNjoHFsvXYbnzpzBX/Q3YffPdmDDxxqw/stzXhfbRNjMtcyb5j2MVB9ZmeFiSndZWLKKvcw28uqxDb5bdduM1NZ/RbzTn0LU9fYjusaO/Cx987gE12X8Olz/Xjg0y+w9ZPbePDGHTx291v85dcP8PeTP+PJn37D1pFR/DdfjZjMnN4orwAAAABJRU5ErkJggg=="
                class="w-full h-full"
                position="left"
                width="718"
                height="553"
              />
            </div>
            <div class="absolute left-0 bottom-0">
              <Image
                src="/static/img/mobile-login.png"
                alt="mobile"
                lazy-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAqCAYAAACz+XvQAAAACXBIWXMAABCcAAAQnAEmzTo0AAAE+0lEQVRIx7VXzW8bRRT3NUpiDiVtHNtrr+Pvtb1uk8ZxTJSmISEhTuq119+ICxeOcESgkKQICQmpUlGN2pIWkBCIvwJxQkJIaQstVHAB5wBnkEFO5/HerMfeOrHrBmHpp5l9O/Pb9zXvjS0W/G1e0jYKxeLVSqVaK5cr18qVSo2jXKnper6WzeZqGU2radlsTc/nuYxQKBSvGWsKV7ScvkBclhdW117z+f3g8/nA6/WCrwWa+1GuKAqEw2FQCDiPRCIIxYASgWA4AN6AF0KhMGRzum7Z3Lx0QBs1LftPsVhsEkqlUrNcLjfT6XQzEAgci2Aw2HS5peZL+ivNV19+/W+37IZiqbRvKRQKDdJgeXmZra+vs9XVVba2tsY2NzbY4uIiw80MNx9BCCH7vSwzvcjKiRXmDQWhWq0eWFCjBpnr8XiY2+0mAMHlcoEsy9zsgEDANOfPaK5/knm8HkZKIeFvnJA20VdjsRjE43GgUVVVjijOI9E4KBEVEQMlqnKQLKxEcV8IgoEgJ6xUq/U2IZlGZDMzM5BIJCCVSkEymYSpqWk4d34ezk7PgXougWPqsWcKBmp+lJA0JBNo3o2A39fDZL6PK9MyuY5ByTdckgRuWeb+I7+ZYfhU7gPuczY5OQmVSqVuyefzDYfdDpIkMafTCSeBw+HgyqDJvxqEDge9YEgKJwHtlTEP8eT8iYR6g75CahOxQGvhoIToHjfTsjmw6Hqu4UFfbWAir6ysAGFqagrshhsG1xBNxjPPkBA1RI0oUhRlSnJy8KDamU3WiNDwoZ07lrQSJj9VUFouy+bQZBEUEtBxOwkoQyjFsOT9zoNCmgVDIRYKhXiJMoNkeM77AskE4R/ch6ShjMWh1wZRMI4DERmFpMtkcmwv/z0pZdCHPLGxih+2g4JnlrXOpTBjILSyQpyUg7aG2AYYlXfyG5V/ueOfvqDiQYSUh9iT6m1Ch32CTUyMg33CRnMOZ+vEDJaHMhGihpTYTgki8VmmqAkIKmchHDvPEQjHwYUVReLp4e4JSXIJwo6Gsoxqeyb5Atnj5SCHj58+9UScOX1K+LDO81BCktmFTZZaysHcRUKWI7WkQ+r5AiQv5mFuKQ/P4bwb88tFSF7IMI+oh7ms1vAFo7B1fZ9dvv0Qdm49gN1bP3Ls7D2Adz/5Ca5++Qtc+eJneOe2IdvFNbRuZ+8+XP74Ibz14XcsGI5BqVTsEL5Z+5Zt37wHWzfuwNs37nJsXb8Du3v34P3P7sN7n/4A2zfvHnm//dH38MYH33QIucmSCxILG4zMTC5qbcy1xsRCBmYvPC5rr0EXzcyn8ZSZWgCdZdv4GLOdeRbMGO967iPrBAWPC48yRpf1S42B00YQUgn6bz1FFhrq/y/hcdWlV9URsqci7Fe+jhBWepjcXQvN7ZVkovcMZDIvZVjjROmnDii6oRjpUkVzU//uIjRdRYwUMu6GQgNxXxQjfYTmRwi7TXZjTlFxpQ2iuJp7R3evoXX0AcdxhE6jLzBxeReXdjKdrmoEqugk45d7XEdAQupFHZMzmcxfNpuNBEz0WFrUMpU+wKjfIAkTBC1/c7QseETuKhZLdcuL6+mvn7FaYXh4+NBqtTKrdRSsowicj+I4MjJiBpfxNW1Y2dDQ0OHY2Bjgf5jPLcsrqwreo/cxckxVCaoAGGPcDDC956B90WjskRqPf6Xl8rZ/AUGC+89yjW1pAAAAAElFTkSuQmCC"
                class="w-full h-full"
                position="left"
                width="196"
              />
            </div>
          </div>
          <div class="container container--xs flex flex-wrap lg:flex-nowrap pb-16 leading-normal text-light-gray-800">
            <div class="w-full lg:w-1/2 lg:w-1/4 flex flex-col lg:pr-4">
              <div class="flex-grow flex mb-2 lg:mb-0">
                <span class="flex-shrink-0 inline-flex items-center h-6 pb-xs mr-3">
                  <i class="zi-check text-blue-700 text-xl" />
                </span>
                <span v-html="'Удаленная работа с&nbsp;кли&shy;ен&shy;та&shy;ми и&nbsp;пос&shy;тав&shy;щи&shy;ка&shy;ми'" />
              </div>
              <div class="flex mb-2">
                <span class="flex-shrink-0 inline-flex items-center h-6 pb-xs mr-3">
                  <i class="zi-check text-blue-700 text-xl" />
                </span>
                <span>Отгрузочные документы</span>
              </div>
              <div class="flex mb-2 lg:mb-0">
                <span class="flex-shrink-0 inline-flex items-center h-6 pb-xs mr-3">
                  <i class="zi-check text-blue-700 text-xl" />
                </span>
                <span>Unit-экономика</span>
              </div>
            </div>
            <div class="flex flex-col">
              <div class="flex mb-2">
                <span class="flex-shrink-0 inline-flex items-center h-6 pb-xs mr-3">
                  <i class="zi-check text-blue-700 text-xl" />
                </span>
                <span v-html="'Статусы производства и&nbsp;доставки'" />
              </div>
              <div class="flex-grow flex mb-2">
                <span class="flex-shrink-0 inline-flex items-center h-6 pb-xs mr-3">
                  <i class="zi-check text-blue-700 text-xl" />
                </span>
                <span>KPI сотрудников</span>
              </div>
              <div class="flex mb-2">
                <span class="flex-shrink-0 inline-flex items-center h-6 pb-xs mr-3">
                  <i class="zi-check text-blue-700 text-xl" />
                </span>
                <span>Личный кабинет клиента</span>
              </div>
              <div class="flex">
                <span class="flex-shrink-0 inline-flex items-center h-6 pb-xs mr-3">
                  <i class="zi-check text-blue-700 text-xl" />
                </span>
                <span v-html="'И&nbsp;многое другое'" />
              </div>
            </div>
          </div>
          <div class="container container--xs flex flex-wrap md:flex-nowrap">
            <div class="w-full md:w-1/2 pb-4 md:pb-0 text-center md:text-left">
              <router-link
                :to="{ name: 'signup' }"
                class="inline-flex items-center text-xl leading-6 rounded-50 font-semibold text-white bg-blue-700 px-10 select-none focus:outline-none focus:bg-blue-800 hover:bg-blue-800"
                style="height: 62px;"
              >
                <span class="px-1">7 дней бесплатно</span>
              </router-link>
            </div>
            <div class="w-full md:w-1/2 flex items-end justify-center text-sm leading-normal text-light-gray-800 pl-6">
              <div class="mt-auto relative">
                <div class="absolute -ml-sm">*</div>
                <span>
                  Программное обеспечение, представленое как сервис.
                </span>
                <br>
                <span>
                  Для использования нужен только браузер.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- HERO / -->
      <!-- / DIVIDER -->
      <div class="py-6">
        <div class="w-px mx-auto bg-light-gray-900" style="height: 50px;"></div>
      </div>
      <!-- DIVIDER / -->
    </div>
    <main>
      <!-- / VIDEO -->
      <div id="video">
        <h3 class="about-section-title font-bold text-center mx-auto mt-10" style="max-width: 772px;">
          <span v-html="video.title" />
        </h3>
        <div class="w-15 h-px py-xs my-6 mx-auto bg-blue-700" />
        <div class="pb-6"></div>
        <div class="relative">
          <div style="max-width: 1000px;">
            <div style="padding-bottom: 20.2%;" />
          </div>
          <div class="about-section-gradient">
            <div style="max-width: 1000px;">
              <div style="padding-bottom: 36%;" />
            </div>
          </div>
          <div class="absolute inset-0 flex justify-center mx-4 md:mx-6">
            <div
              style="max-width: 1000px;"
              class="relative bg-gray-900 overflow-hidden w-full h-full rounded-12 shadow-large"
            >
              <div class="absolute inset-0">
                <!-- <iframe v-if="isVideoActivated" class="w-full h-full" width="1206" height="678" src="https://www.youtube.com/embed/LMFUvAmbwS0?rel=0&controls=2&color=red&modestbranding=1&autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->
                <div id="ytplayer" class="w-full h-full"></div>
              </div>
              <transition name="fade">
                <div
                  v-if="!isVideoActivated"
                  class="about-video absolute inset-0 flex items-center justify-center cursor-pointer bg-gray-900"
                  @click="playVideo"
                >
                  <img
                    src="@/assets/img/video-preview.svg"
                    alt="video-preview"
                    style="height: 50%; min-height: 140px;"
                  >
                  <div class="about-video__play absolute inset-0 flex items-center justify-center">
                    <svg width="121" height="121" viewBox="0 0 121 121" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle opacity="0.2" cx="60.7686" cy="60.0278" r="60" fill="#C4C4C4"/>
                      <path d="M86.0371 57.4298C88.0371 58.5845 88.0371 61.4712 86.0371 62.6259L50.0371 83.4105C48.0371 84.5652 45.5371 83.1218 45.5371 80.8124L45.5371 39.2432C45.5371 36.9338 48.0371 35.4904 50.0371 36.6451L86.0371 57.4298Z" fill="white"/>
                    </svg>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
      <!-- VIDEO / -->
      <!-- / SECURITY -->
      <div id="security" class="container container--xs pt-16 sm:pt-20 pb-16">
        <div class="flex flex-wrap lg:flex-nowrap pt-6 pb-6">
          <div class="w-full flex-shrink-0" style="max-width: 532px;">
            <h3
              v-html="security.title"
              class="about-section-title font-bold"
            />
            <div class="w-15 h-px py-xs my-6 bg-blue-700" />
            <div
              v-html="security.text"
              class="text-lg leading-relaxed text-light-gray-900"
            />
          </div>
          <div class="flex-grow flex lg:justify-center px-6 pt-5 lg:pt-2">
            <div class="pt-xs">
              <img src="@/assets/img/amazon-logo.svg" alt="amazon">
            </div>
          </div>
        </div>
        <div class="flex flex-wrap -mx-4">
          <div
            v-for="(item, i) of security.blocks"
            :key="i"
            class="w-full md:w-1/2 lg:w-1/3 h-full py-8 px-4"
          >
            <div class="flex flex-col">
              <div class="pb-10">
                <img
                  :src="require(`@/assets/img/${item.icon}`).default"
                  alt="icon"
                >
              </div>
              <h4
                v-html="item.title"
                class="leading-tight font-bold mb-6 text-22"
              />
              <p
                v-html="item.text"
                class="leading-relaxed text-light-gray-900"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- SECURITY / -->
      <!-- / FEATURE -->
      <div id="feature" class="about-section-bg relative pt-24">
        <div>
          <div class="container container--xs flex w-full overflow-x-auto mb-8">
            <nav class="tabs relative inline-flex justify-center mx-auto text-2xl text-black font-bold leading-7">
              <div class="absolute bottom-0 inset-x-0 h-px bg-light-gray-600 mx-5" />
              <a
                v-for="feature of features"
                :key="feature.value"
                class="relative cursor-pointer mx-5"
                @click.prevent="activeFeature = feature.value"
              >
                <span
                  v-html="feature.title"
                  class="inline-block mb-xl"
                />
                <div
                  :class="{ 'bg-blue-700': activeFeature === feature.value }"
                  class="absolute bottom-0 w-full h-px py-xs bg-transparent transition-colors duration-100 ease-out"
                />
              </a>
            </nav>
          </div>
          <div>
            <Window v-model="activeFeature">
              <WindowItem
                v-for="feature of features"
                :key="feature.value"
                :value="feature.value"
                class="pb-24"
              >
                <div
                  class="text-lg text-light-gray-900 w-full text-center mx-auto px-4 lg:px-0 pb-3"
                  style="max-width: 986px; line-height: 32px; min-height: 174px;"
                >
                  {{ feature.text }}
                </div>
                <div class="px-4 pb-12">
                  <div
                    style="max-width: 830px;"
                    class="overflow-hidden mx-auto rounded-12 shadow-large"
                  >
                    <Image
                      :src="`/static/img/${feature.img}`"
                      :alt="feature.title"
                      :aspect-ratio="1.627"
                      :lazy-src="feature.preview"
                      class="w-full h-full"
                      contain
                    />
                  </div>
                </div>
              </WindowItem>
            </Window>
            <div class="absolute inset-x bottom-0 w-full flex justify-center pb-24">
              <div class="flex justify-center">
                <div
                  v-for="n of features.length"
                  :key="n"
                  class="flex items-center justify-center cursor-pointer w-3 h-3 mx-sm"
                  @click="activeFeature = n"
                >
                  <div
                    :class="[
                      'rounded-full',
                      activeFeature === n ? 'w-full h-full bg-gray-900' : 'w-2 h-2 bg-light-gray-900',
                    ]"
                  >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- FEATURE / -->
      <!-- / ISSUE -->
      <div class="container container--xs pt-24 pb-12">
        <div class="flex flex-col xl:flex-row py-1">
          <div class="w-full flex-shrink-0" style="max-width: 849px;">
            <h3
              v-html="issue.title"
              class="about-section-title font-bold"
            />
            <div class="w-15 h-px py-xs my-6 bg-blue-700" />
          </div>
          <div class="order-first xl:order-none flex-grow h-0 relative">
            <div class="about-cloud-lock absolute xl:left-0 bottom-0 right-0 xl:right-auto xl:-mb-16">
              <img src="@/assets/img/cloud-lock.svg" alt="cloud" class="ml-auto w-56 md:w-64 xl:w-auto">
            </div>
          </div>
        </div>
        <div class="flex flex-wrap -mx-4 pt-1">
          <div
            v-for="(item, i) of issue.blocks"
            :key="i"
            class="w-full md:w-1/2 lg:w-1/3 h-full py-8 px-4"
          >
            <div class="flex flex-col">
              <div class="pb-10">
                <img
                  :src="require(`@/assets/img/${item.icon}`).default"
                  alt="icon"
                >
              </div>
              <h4
                v-html="item.title"
                class="leading-tight font-bold mb-6 text-22"
              />
              <p
                v-html="item.text"
                class="leading-relaxed text-light-gray-900"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- ISSUE / -->
      <!-- / ADVANCE FREATURE -->
      <div class="about-section-bg relative pt-24">
        <div class="pb-10">
          <Window v-model="activeAdvanceFeature">
            <WindowItem
              v-for="feature of advanceFeatures"
              :key="feature.value"
              :value="feature.value"
              class="pb-24"
            >
              <div
                v-html="feature.title"
                class="font-bold text-center mx-auto"
                style="max-width: 510px; min-height: 88px; font-size: 36px; line-height: 44px;"
              />
              <div class="w-15 h-px py-xs my-5 mx-auto bg-blue-700" />
              <div class="text-lg text-light-gray-900 w-full text-center mx-auto px-4 md:px-0" style="max-width: 646px; line-height: 32px; min-height: 128px;">
                {{ feature.text }}
              </div>
              <div class="px-4 pb-12">
                <div
                  style="max-width: 830px;"
                  class="overflow-hidden mx-auto rounded-12 shadow-large"
                >
                  <Image
                    :src="`/static/img/${feature.img}`"
                    :alt="feature.title"
                    :aspect-ratio="1.627"
                    :lazy-src="feature.preview"
                    class="w-full h-full"
                    contain
                  />
                </div>
              </div>
            </WindowItem>
          </Window>
          <div class="absolute inset-x bottom-0 w-full flex justify-center pb-32">
            <div class="flex justify-center">
              <div
                v-for="n of advanceFeatures.length"
                :key="n"
                class="flex items-center justify-center cursor-pointer w-3 h-3 mx-sm"
                @click="activeAdvanceFeature = n"
              >
                <div
                  :class="[
                    'rounded-full',
                    activeAdvanceFeature === n ? 'w-full h-full bg-gray-900' : 'w-2 h-2 bg-light-gray-900',
                  ]"
                >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- ADVANCE FREATURE / -->
      <!-- / POWER -->
      <div class="container container--xs py-24">
        <div class="flex flex-col xl:flex-row py-1">
          <div class="w-full flex-shrink-0" style="max-width: 578px;">
            <h3
              v-html="power.title"
              class="about-section-title font-bold"
            />
            <div class="w-15 h-px py-xs my-6 bg-blue-700" />
          </div>
          <div class="order-first xl:order-none flex-grow h-0 relative">
            <div class="absolute xl:left-0 bottom-0 right-0 xl:right-auto lg:-mb-40 xl:pl-64">
              <img src="@/assets/img/currency-usd.svg" alt="currency" class="h-48 lg:h-auto">
            </div>
          </div>
        </div>
        <div class="flex flex-wrap -mx-4 pt-1 pb-4">
          <div
            v-for="(item, i) of power.blocks"
            :key="i"
            class="w-full md:w-1/2 lg:w-1/3 h-full py-8 px-4"
          >
            <div class="flex flex-col">
              <div class="pb-10">
                <img
                  :src="require(`@/assets/img/${item.icon}`).default"
                  alt="icon"
                >
              </div>
              <h4
                v-html="item.title"
                class="leading-tight font-bold mb-6 text-22"
              />
              <p
                v-html="item.text"
                class="leading-relaxed text-light-gray-900"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- POWER / -->
      <!-- / CLIENT CABINET -->
      <div class="about-section-bg relative pt-24 pb-48">
        <div class="flex flex-wrap px-4">
          <div class="w-full md:w-1/2"></div>
          <div class="w-full md:w-1/2 relative">
            <div class="absolute right-0 lg:right-auto lg:left-0 top-0 -mt-32 xl:-ml-8">
              <img src="@/assets/img/user-group.svg" alt="user" class="h-64 lg:h-auto">
            </div>
          </div>
        </div>
        <div class="container container--xs flex pt-32 pb-10 lg:mt-6">
          <div class="w-full flex-shrink-0" style="max-width: 518px;">
            <h3 class="about-section-title font-bold">
              Кабинет клиента
            </h3>
            <div class="w-15 h-px py-xs my-6 bg-blue-700" />
            <div class="text-lg leading-relaxed text-light-gray-900">
              На время сделки у вашего клиента появится свой личный кабинет.Система вовлекает клиента в работу над заказом и упрощает все процессы, с ним связанные, — в течение сделки кабинет клиента хранит информацию о сроках оплаты и доставки, показывает статус товара, позволяет комментировать работу менеджеров, загружать фотографии товара и распечатывать все необходимые документы самостоятельно.
            </div>
          </div>
          <div class="flex-grow about-imac__wrapper">
            <div class="about-imac absolute hidden lg:block">
              <Image
                src="/static/img/imac.png"
                alt="imac"
                lazy-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAASCAYAAABb0P4QAAAACXBIWXMAABCcAAAQnAEmzTo0AAABqElEQVQ4y+2Ty0rDQBRAh07SJH3E4lZN0/T9ik1aWwXX2tbiA0QXfoKILuzCT9CFuPQL/AIbBKFL3fgFuhKk6EZXgto21zullarQhY+VDhxmcif33HsXQyil9wggdhfgOO4Nnuff4XQ6P2IjbUEQQJKkS8IEhBAbgW/QyRdF8ZYJ231B+4uydlfYYEK7v8oX+Rf+LaHD4fgxIb6YBhEFsSkgaEekDpLk6tFyudy2x+MFhtvtYecW0mR4vXKPF1keAp/Pd0MCahgYWiACQS0KoWAMIuEERCNJiEVTkIjroPqDtqaFbT1tAiMzngMjMwFZowC57CRM5KagkJ9m50eiKNqRX9FO/EqwFlBDFootFFsoPg6H4nX8fh4dUUEZC7BiT1ignk4Zx3rasMb1rIVyC+U108yfZs3CIRm0XJIsxWP6AwraqaQB8Vj6TvYOywOTVH+I9sBuKHZFcSye3RVnK0vl0gLMlRehgpSK81CcqSyzOxyTx86oaeQpdkZxXIoxx6cCW5vVzn5+dsGtrqxtYNI+FthDdo1M7gBj61eX1xz7p7q9Q359vQJniU6TYFWMRAAAAABJRU5ErkJggg=="
                class="w-full h-full"
                position="left"
                width="787"
                height="690"
              >
                <div class="absolute right-0" style="top: 31px; left: 31px; height: 58.8%;">
                  <Image
                    :src="$breakpoint.width > 1440 ? '/static/img/client-cabinet_lg.png' : '/static/img/client-cabinet.png'"
                    alt="client"
                    lazy-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAOCAYAAAAvxDzwAAAACXBIWXMAABCcAAAQnAEmzTo0AAAB9UlEQVQ4y4VTbYsaQQz2p6pFrqj4zb95lFIKpWDPlqvuuq+zMztvO0mTeGM9Wu6Eh8lkkyd5knE2n8/DarXC/X4Pm80G1+s17nY73G63+PDwgMvlAj8QFov/Y/txi8vFUnI4f5ZSCtY5PJ3OcD6fsSgKLMsSL5cLdk2Fn54MPj55RJgwxgmn6YpE8D6gUgYHbVENRu4zRAxAwaqroWk7rOsam6YRdF2LVaNQGYfBe0r4F9yMtQ6d80jN4QwAiBBQ9S3UVUWVBhzHkQKcBBujKdGJzxiDWms5B4pjGLprihlGLZ0LIXWJ5fMRfnz7gj5E9ESUpU0kkwuyHWMUTCLXiw2JvpFCk0axb4RqKODnr89UnSWMGEIQjMlhpAS2mSj7WQETsswUaKaaTkh/CYvfR/j+9VFmwVI4SYKTp8pBFsL33GEm4+755Hi2b4R1eYLi+UiSw22GTB69Jhjy2etcrRX0fX+TzWRsy1J4y9cKESJVdta+kOVkJ2Rt20rn7FNK4eFwoFfQyYK4AYYsRQhJe6974MB7MIF+IclJ2ebvmezqs/eEEZuugOpSyYPOyG/S2tdys4J73ytCXnujamibFogAiEhAMoFkASW8CyIEIgQh5GdRdCW+1eF7MHczdDRD0FYnmomA/g0CtmlGibb4JmjTcvLvD7CLHLEeUgGpAAAAAElFTkSuQmCC"
                    class="w-full h-full"
                    position="left top"
                    max-width="724"
                  />
                </div>
              </Image>
            </div>
          </div>
        </div>
      </div>
      <!-- CLIENT CABINET / -->
      <!-- / ACTION -->
      <div class="relative" style="top: -88px;">
        <div class="container container--xs">
          <div class="flex flex-col items-center text-center bg-gray-900 rounded-12 py-20 px-3">
            <h3 class="text-4xl leading-tight font-bold text-white" style="max-width: 1010px;">
              Станьте одним из первых поль&shy;зо&shy;ва&shy;те&shy;лей мощнейшего проекта в меж&shy;ду&shy;на&shy;род&shy;ной торговле
            </h3>
            <div class="w-15 h-px py-xs my-6 bg-blue-700" />
            <div class="text-xl leading-normal text-white opacity-50 pb-8" style="max-width: 600px;">
              Бесплатный пробный доступ предоставляется на 7 дней. Этого времени хватит, чтобы оценить удобство сервиса и навсегда полюбить ZENNNN.
            </div>
            <div
              v-html="'Первой 1&nbsp;000 пользователей подарим доступ на&nbsp;1&nbsp;месяц'"
              class="text-white text-xl leading-6 pb-8"
            />
            <router-link
              :to="{ name: 'signup' }"
              class="inline-flex items-center justify-center text-xl leading-6 rounded-50 font-semibold text-white bg-blue-700 select-none focus:outline-none focus:bg-blue-800 hover:bg-blue-800 text-center w-full sm:w-auto px-2 sm:px-10"
              style="height: 62px;"
            >
              <span class="px-1">Начать бесплатное тестирование</span>
            </router-link>
          </div>
        </div>
      </div>
      <!-- ACTION / -->
      <!-- / USER INTERFACE -->
      <div class="container container--xs flex flex-wrap pt-12 pb-48 xl:pb-40">
        <div class="w-full lg:w-1/2 xl:-ml-10 xl:mr-10 pb-16 lg:pb-0">
          <div
            class="relative flex justify-center h-full mx-auto lg:m-0 pt-16"
            style="max-width: 510px; min-height: 640px"
          >
            <div class="absolute top-0" style="left: 16%; z-index: -1;">
              <img src="@/assets/img/cog.svg" alt="cog">
            </div>
            <div class="absolute left-0" style="padding-top: 100px; width: 240px;">
              <Image
                src="/static/img/iphone11.png"
                alt="mobile"
                lazy-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAoCAYAAAD+MdrbAAAACXBIWXMAABCcAAAQnAEmzTo0AAAFAElEQVRIx51XSU8sVRSuQEIiczPTQDc91NBVPTJPkSEQ5rERYgJ7fplbF8aFS3cmgjuDW3kLFy9qNEbfW9y6ft+p6qKBZlCSL/dU9a3vnvGeg2Hgb2pq6hK4npubu1tYWLhbXl6+W1lZuVtdXRXUZK41mXtmZ2cFk5OT3+H7KrkMvPjcNE2dSqX0xMSELhQKuqWlReOnCM3NzRGamprk3SetrbpUKutKZUKn02ltWZaGQtvG2tratyQ8PDz8eHV15Z+efqYcx1GDg4NqaGhIMDw8rAYGBuQd0dvbqwrForq8vFQXFxf+8fHxR3yjNzY2vjK2trZuyQ5T1fz8vD87N+dvb2/rg4MDvbOzo3d3dzWfYapeX18X4EMNkzX3Tk9P+9BMkQN7rw18dNvd3a07OjpUe3u7j1W3tbXpVpjU2dkZgXu6uroi8DkWixE+ZGpNJa4NsN7yoVQqqVwup23b1p7n6Xw+r2M9PTxICLk+ByiiSH50dHRtVKvVX/jBSDzuAxr+0vE4Ede9IOwBeGBPKD8GfwOZogzCGwMOfUcT0pmMMh1XW7m8zlqOpuy4BZ1FwBjFV6D6+/sZ2Bua/BPVNU1L2Q5MBizbEdg5VwgzmcxrqBFeGyfV6p80GYS+4xWhVV6IKJuWrdPIz3Q686KGdYQ/GKenp38LoWX5JLKdABY0zWbfpB32ZX368uzs7L1xcnLyBwmz0NCGdhYJsZrwY2p8XCroNUBLn0E5Pz//zdjf3/+ZOUXHpus3BRvfBOyvEf7KtPmLGlq27ecKJfGdWyjrXL6Ed7lXiekWmhwS/h750KIPkdQBHAEOkaJ/CdyPu0B8CK53BpLxPfMwIHT0PalVJ78MEEqUo9KLxboZFEUzGRCanslkYdKb/fgosREUnhKkTZDcb0zox4l9E2gohJZyvAKCgeTGKkn9Rg2fIYSGrhdVRybY+P81zIYms4bpv/9A9jyhmIrca1AJAUR+mvRPCFkpCL/yvLx2cbm6Li4H9AheuJSZb/CxaE+XyIrnZzUkoee6ahJdD+1QoxNKB0S/YCeT25vucIsVCRoriemVvvdz4yiLD50A3HhfXvRpui7qqXqyxhoGhJ4meHWlgqJ/5MfAhw0y4Ckhe7EbNimai7YqpnOl6WIyTPVgNv1Ijevuw4eErOWRkRE1NjamR4FkMqnHcRdyrWlHOZkcFyQSCc29RChLG32gISKpAl9lIjP5zI9qrbQzbJv1/TpssdJGH2jIU6hVIgEtR0eFKJlMSDutNXmujYDfHhLyJUxSKTSje2SDFVWDm0jAQPHQeoTvVF9fX13a4PpCk5JKYX6x81Hm7c1nO3zGniDKdRFmgteCgvvwXkNUhCoVi7qIcS6PauFaQELn85CLBfyOfm2ZD3s1fBx2xqeEmGcU04OVUqlUZMUgKTLTp1wuizbM02iaCAPXkBB1q/hREVpy6OTKZ5YdP6r1j6BC0kIurmEhwF30obSAzc3NiBAa+UxqEnGlhiQmES8LkkbJbAbmA36tp8h8iIHzx+7wgsVGn+BES1AzrvYz3c80s36AgHBvb+97A5Pp1xh3qeGHpaUl+suHTOjHIHEUYUwLqHnfK5bphg/MWwzzXxgw7VN2fszOTGjFpA5mxHhDYOYWcP+gyDJ/85B/4KKy/CcwMzNTQVS/4UUALX2cRPBEjaFeZmyCMsH3sMwnFhcXeXl8CQ6XXP8C+YpxMXclRHgAAAAASUVORK5CYII="
                class="w-full h-full about-iphone"
                contain
              />
            </div>
            <div class="absolute right-0" style="width: 240px;">
              <div class="absolute" style="bottom: -60px; right: 0; width: 140px; z-index: -1;">
                <img src="@/assets/img/cog.svg" alt="cog">
              </div>
              <Image
                src="/static/img/huawei.png"
                alt="mobile"
                lazy-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAqCAYAAACz+XvQAAAACXBIWXMAABCcAAAQnAEmzTo0AAAFgUlEQVRIx6VXS08bVxi11E1KEkggEGJj/JiXPR7b2BgbEwMhUVASJWJTwDhsswgt2CTqqu0uqyzi/oCqpd1Sqetuqq6qSF1X6qYlP6DrVvHYvj3njsceO4ZQFenoju/ju+d7X3w+/O0f1PI7lccvy+Wd+s5O5dVOpVInKpXH9e1yub61tV3/aHOzvrm5Vd/edn4T2P8K61/i7IvD55/qlOWr1g6XM5lsO5vNips3b4rFxUVRyOdFvoNcLifm5+clFhZyIr+wgNEB95ZKJZHJZLC38Ndnn3+h+J7u7X3HiY2Njb+fPHnSuHfvXuPWrVuN27dvN9bW1uS3OxKrq6uNlZWVxhrWy+VyY3d3t/Hw4cN/CoWCOHz27KWvWq19TyZg11xeXm5jbD948EA8evRIYKPE/fv3BYSKu3fvivX1dTlCsFjCXgJMm9TuoFr7lgKPg8EZMTo6al+5cqV99epVMTU1Ja5fv96HwTn+lnNTUzzTVFVV1GqH38AhB8czMzMClG2ygDrC7/eLkZERcfnyZXHp0qVTwXXiwoULzdnZWVE7fHbkOzioHgcCfhGJRGwNtyhKVExOToqxsVEBxoKMz8L4+DiFNsPhsCsQDAMBEZwN2RFFE4Si6UKLxYVmxEUkGhXcjAvfgTsfDAalyjDfkVSZNtQ03Y6ZCUHoEGbETHxbQlVxgaKcCgqC0KamaXSKwzAIG6oUmEg6wiCUoLAoGPIgx2HgGpg2aa5qzWVIgapmG3FTCnShamezcxlCYIvf+wfVnzsMA0LTDTtupaSaMYyaEZP2OY3ZAENH4H71teMUCMSkHe0Y+31CBgUiZFr8BsNfnDiEl6OKapvprEgAigJDn+LZQXCvw1AKfO2xoWob0rsIFx1hA/udBzr2gp1rw5+6ArFoG1g0dE0Yhi5isdi5EI/HqbYbh27qBYSq67aZnBMMnXgy3Q2VszzsdYqKEXH4YzeXGTYyXOBdQpFpqJwrbGBLV+VfezZEYJNZ3CJS/C2i/yFsKBh14YdepjCwkW6IR3nredh5AlumHmz4dV+mxBKWDOj32W4QHoGDqZeQDP+XwF5xAEPzbIZy3rWdZ8+7AlG+dAjUEYNsNqzc6C8SrOBLS0XBwsEsosPMVEbmPLOjJ1DtFygDm4FqmsKyLGFidMHgZeVhBtH7qJ3dStRzijqgMqoNq4zBmhi3ZDVmn3AQkiHk5He4L5yGOyUYdBgi5Vwwrdiv2eD5CCArqk14w2ogbI665Qu32W7CcyMF8tUgXwkYqaqsldJ2yjsM+3qK3x+QXY9qhqGOYRiy53q728TEhJhAh5PA97Vr17rj2NhYr+t9sr8vVQYTO5VKSTX5XuHGixcvdnvvWb2ZfTkUColDty/fuHGDvdj2vgo4x4Z/HuBsk+rj5QCV951qw56SSGeEiQKRzCxIvLeEYY3OQu/utdGuQGYKHEH76bohK/GwCk3je8E52Zf7neIXc3Nz9p07d2R20JbDqjYvYXlTHSEyHtm7w30CwTCAJgVmdjKZlJlBloNw2Q8y7TLUhjDk24+vUjIZ1j86DUmyY1ySrem0CycOvU5h18NtbR4axtAF13uQXa8d7Tily5AqQ9VmOp1u41DbPTzYLjVPQaDNUCzasVi87el6R769vY+Pp6enBYS9LRaLLVSWFtSTI5zTBdZbsLFcw2G8FCIthFoLKvPV8JaZgrD5yre1vf2U3Z8vVvcByYcmL2FtHATf41xzH6PjwMjIh9LGlce7G/zP4oP0XOZFsbj0+8rK6ptSafnP0jJQKr1ZXCyedPBHB3IOaycIrxPsO8GZk3yh8NtcJvvc5/3LZHPTlpWMJKxkyExYISuZCmfnc+F5AGOI6HyHuZZIWBL4jszn8pOunH8BidDAdkhPdVIAAAAASUVORK5CYII="
                class="w-full h-full about-huawei"
                contain
              />
            </div>
          </div>
        </div>
        <div class="w-full lg:w-1/2 sm:px-10 lg:pt-16">
          <div class="pl-6 ml-1">
            <div class="inline-block">
              <img src="@/assets/img/logo-light.svg" alt="Logo" style="height: 46px;">
            </div>
            <div class="w-15 h-px py-xs my-6 bg-blue-700" />
            <div class="text-lg leading-relaxed text-light-gray-900 pb-8">
              {{ userInterface.text }}
            </div>
          </div>
          <div class="text-black text-lg">
            <div
              v-for="(item, i) of userInterface.blocks"
              :key="i"
              class="flex mb-5 leading-6"
            >
              <span class="flex-shrink-0 inline-flex items-center h-6 mr-4">
                <i class="zi-check text-blue-700 text-lg" />
              </span>
              <span>{{ item.text }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- USER INTERFACE / -->
      <!-- / REVIEW -->
      <div id="review" class="py-32 bg-gray-900">
        <div class="container container--xs flex flex-col md:flex-row relative py-5">
          <div class="absolute right-0 transform -translate-y-full px-4" style="top: -90px;">
            <img src="@/assets/img/quote-open.svg" alt="quote" class="w-48 lg:w-auto">
          </div>
          <div class="pb-6 md:pb-0 mr-4 lg:mr-16 xl:mr-32" style="max-width: 245px;">
            <div class="about-section-title text-white font-bold pb-12">
              Отзывы наших клиентов
            </div>
            <div class="flex">
              <button
                class="cursor-pointer text-light-gray-400 mr-10 select-none focus:outline-none focus:text-blue-700 hover:text-blue-700 transition-colors duration-100 ease-out"
                @click="$refs.reviewWindow.prev()"
              >
                <svg width="20" height="33" viewBox="0 0 20 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.0898 31.4453L3.08985 16.4453L18.0898 1.44531" stroke="currentColor" stroke-width="3"/>
                </svg>
              </button>
              <button
                class="cursor-pointer text-light-gray-400 select-none focus:outline-none focus:text-blue-700 hover:text-blue-700 transition-colors duration-100 ease-out"
                @click="$refs.reviewWindow.next()"
              >
                <svg width="19" height="33" viewBox="0 0 19 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.08984 1.44531L16.0898 16.4453L1.08984 31.4453" stroke="currentColor" stroke-width="3"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="flex-grow">
            <Window
              v-model="activeReview"
              ref="reviewWindow"
              continuous
            >
              <WindowItem
                v-for="review of reviews"
                :key="review.value"
                :value="review.value"
                class="md:px-4 lg:px-10 xl:px-20"
              >
                <div class="relative inline-block pb-3">
                  <svg class="w-full lg:w-auto h-auto" width="508" height="330" viewBox="0 0 508 330" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.5">
                    <rect y="0.445312" width="508" height="297" rx="12" fill="#333333"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M57.8002 279.945C57.8002 278.841 56.9048 277.945 55.8002 277.945H2C0.895431 277.945 0 278.841 0 279.945V327.483C0 329.683 3.44746 330.451 4.5706 328.56C15.6694 309.872 35.3596 297.445 57.7999 297.445C57.8001 297.445 57.8002 297.445 57.8002 297.445V279.945Z" fill="#333333"/>
                    </g>
                  </svg>
                  <div
                    class="absolute left-0 top-0 w-full max-h-full text-lg leading-relaxed overflow-y-scroll text-light-gray-500 pl-5 sm:pl-10 pr-5 sm:pr-8 pt-4 sm:pt-10"
                    style="bottom: 44px;"
                  >
                    <span>{{ review.text }}</span>
                  </div>
                </div>
                <div class="pl-6 mr-5">
                  <div class="flex items-center">
                    <div
                      class="flex-shrink-0 mr-5 bg-gray-100 rounded-full"
                      style="width: 56px; height: 56px;"
                    >
                      <img :src="`/static/img/${review.avatar}`" alt="avatar">
                    </div>
                    <div>
                      <div class="text-white text-xl leading-6 font-bold">
                        {{ review.author }}
                      </div>
                      <div class="text-light-gray-900 leading-5">
                        {{ review.position }}
                      </div>
                    </div>
                  </div>
                </div>
              </WindowItem>
            </Window>
            <!-- <div class="relative mx-20">
            </div> -->
          </div>
        </div>
      </div>
      <!-- REVIEW / -->
      <!-- / TEAM -->
      <div class="bg-light-gray-200 py-24">
        <div class="container container--xs pt-sm">
          <h3 class="about-section-title font-bold">
            Cильная команда<br>практиков
          </h3>
          <div class="w-15 h-px py-xs my-6 bg-blue-700" />
          <div class="">
            <div class="flex flex-wrap -mb-4">
              <div
                v-for="(member, i) of team"
                :key="i"
                class="pb-4 sm:pr-5 w-full sm:w-auto"
              >
                <div
                  class="flex items-center bg-white text-black rounded-10 shadow-medium px-sm py-3"
                >
                  <img
                    :src="require(`@/assets/img/flags/rounded/${member.country}.svg`).default"
                    :alt="member.country"
                    class="w-8 h-8 ml-1 mr-sm"
                  >
                  <span
                    v-html="`<strong>${member.name}</strong>, ${member.position}`"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- TEAM / -->
      <!-- / ADVANCE ACTION  -->
      <div class="bg-gray-900 py-20">
        <div class="container container--xs pt-5 pb-sm">
          <div class="flex flex-col items-center text-center">
            <h3 class="about-section-title font-bold text-white" style="max-width: 643px;">
              Убедитесь, что ZENNNN полезен вашему бизнесу
            </h3>
            <div class="w-15 h-px py-xs my-6 bg-blue-700" />
            <div class="text-white text-xl pb-10">
              Если бы биты и пиксели умели любить,<br>ZENNNN стал бы первой программой, которая полюбила человека.
            </div>
            <div class="text-white text-xl pb-10 mb-3" style="max-width: 910px;">
              За время взаимодействия с ZENNNN деятельность Вашей компании станет прозрачной, наладится управленческий учёт, а на своих должностях останутся только самые эффективные сотрудники
            </div>
            <router-link
              :to="{ name: 'signup' }"
              class="inline-flex items-center justify-center text-lg leading-tight rounded-50 text-white bg-blue-700 select-none focus:outline-none focus:bg-blue-800 hover:bg-blue-800 text-center w-full sm:w-auto px-2 sm:px-10"
              style="height: 82px;"
            >
              <span class="px-1">
                Получить доступ в систему<br>на <span class="font-bold">бесплатный</span> пробный период
              </span>
            </router-link>
          </div>
        </div>
      </div>
      <!-- ADVANCE ACTION / -->
    </main>
    <footer class="about-footer text-black leading-6 py-6">
      <div class="text-center py-1 px-4">
        <span class="inline-block sm:inline">Copyright © 2015-2019 ZENNNN.</span> <span class="inline-block sm:inline">All rights reserved.</span>
      </div>
    </footer>
  </div>
</template>

<script>
import Image from '../components/Base/Image'
import { Window, WindowItem } from '../components/Base/Window'

const INFO_ALERT_TOP = 90
const SCROLL_THRESHOLD = 90

export default {
  name: 'About',
  components: {
    Image,
    Window,
    WindowItem,
  },
  // metaInfo: {
  //   link: [
  //     { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700,900&display=swap&subset=cyrillic' },
  //   ],
  //   style: [
  //     { cssText: 'body { font-family: Montserrat,sans-serif }', type: 'text/css' },
  //   ],
  //   meta: [
  //     { hid: 'title', name: 'title', content: 'Сервис для международной оптовой торговли с удаленным управлением | ZENNNN' },
  //     { hid: 'description', name: 'description', content: 'Представляем вам революционной сервис международной оптовой торговли с возможностью удаленного контроля и управления закупками. Вся операционная деятельность компании в одной системе.' },
  //     { vmid: 'og:title', property: 'og:title', content: 'Сервис для международной оптовой торговли с удаленным управлением | ZENNNN' },
  //     { vmid: 'og:description', property: 'og:description', content: 'Представляем вам революционной сервис международной оптовой торговли с возможностью удаленного контроля и управления закупками. Вся операционная деятельность компании в одной системе.' },
  //     { vmid: 'og:site_name', property: 'og:site_name', content: 'ZENNNN' },
  //     { vmid: 'og:url', property: 'og:url', content: `${process.env.VUE_APP_HOSTNAME}${window.location.pathname}` },
  //     { vmid: 'og:image', property: 'og:image', content: `${process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME}/ses/zennnn_logo_light_2x.png` },
  //   ],
  // },
  data () {
    return {
      isHeaderActive: true,
      isScrollingUp: false,
      savedScroll: 0,
      previousScroll: 0,
      currentScroll: 0,
      infoAlertTop: INFO_ALERT_TOP,
      isInfoAlertActive: true,
      activeNav: -1,
      navItems: [
        {
          text: 'Система',
          sectionId: 'video',
          rect: null,
        },
        {
          text: 'Безопасность',
          sectionId: 'security',
          rect: null,
        },
        {
          text: 'Функции',
          sectionId: 'feature',
          rect: null,
        },
        {
          text: 'Отзывы',
          sectionId: 'review',
          rect: null,
        },
      ],
      video: {
        title: 'ZENNNN уже рассказал о&nbsp;себе за&nbsp;четыре минуты',
      },
      security: {
        title: 'Бе&shy;зо&shy;пас&shy;ность ваших данных <span class="font-extrabold">га&shy;ран&shy;ти&shy;ру&shy;ет</span>',
        text: 'Ваши данные защищает мировой лидер в сфере серверных инфраструктур',
        blocks: [
          {
            icon: 'shield.svg',
            title: 'Физическая безопасность',
            text: 'ZENNNN защищает данные от перебоев электричества, интернет-соединения и некорректной работы физических носителей.',
          },
          {
            icon: 'server.svg',
            title: 'Архитектурная безопасность',
            text: 'Одна компания — одна база данных. ZENNNN хранит информацию изолированно. Это исключает возможность каскадного взлома.',
          },
          {
            icon: 'eye-system.svg',
            title: 'Системная безопасность',
            text: 'ZENNNN фиксирует все действия, выполненные в системе вашими сотрудниками. Это предупреждает кражу информации изнутри компании.',
          },
          {
            icon: 'eye-close.svg',
            title: 'Человеческий фактор',
            text: 'Понятное взаимодействие и простой интерфейс ZENNNN исключают ошибки, которые совершаются от переутомления или по невнимательности.',
          },
          {
            icon: 'drama-masks.svg',
            title: 'Безопасность по ролям',
            text: 'Каждый сотрудник (должность) в вашей компании имеет свой уровень доступа к информации, который устанавливаете, изменяете и контролируете только вы.',
          },
        ],
      },
      issue: {
        title: 'ZENNNN знает частые проблемы и помогает их решать',
        blocks: [
          {
            icon: 'timer.svg',
            title: 'Сроки всегда горят',
            text: 'ZENNNN имеет автоматическую систему уведомлений, которая предупредит вас о любых задержках и горящих сроках.',
          },
          {
            icon: 'finance.svg',
            title: 'Ошибки в финансах',
            text: 'ZENNNN позволяет контролировать финансовые вопросы компании — определяет лидера продаж среди товаров благодаря unit-экономике и помогает планировать сделки, исходя из уровня прибыли.',
          },
          {
            icon: 'ufo.svg',
            title: 'Много непонятных систем',
            text: 'ZENNNN — первая система, созданная предпринемателями, а не программистами. В ZENNNN нет бесконечного количества непонятных функций, а только то, что используется каждый день. На первом плане всегда финансовые показатели и КРI струдников.',
          },
          {
            icon: 'factory.svg',
            title: 'Поставщики подводят',
            text: 'ZENNNN уведомит поставщиков о приблежающемся дедлайне и напомнит об условиях заказа. Будет хранить фотоотчеты прямо в заказе и автоматически поделится существенной информацией с вашим клиентом. Такой подход позволит освободить время сотрудников для более важных задач.',
          },
          {
            icon: 'translate.svg',
            title: 'Языковые барьеры',
            text: 'ZENNNN — мультиязычная программа. По сути, ваши поставщики смогут общаться с клиентами из любой точки мира, забыв о языковых барьерах, а вы и ZENNNN будете контролировать этот процесс.',
          },
          {
            icon: 'anvil.svg',
            title: 'Кто реально работает',
            text: 'ZENNNN наблюдает за уровнем продуктивности сотрудников, полностью фиксирует их действия и показывает вам, какие люди приносят компании доход, а какие &mdash; нет.',
          },
        ],
      },
      power: {
        title: 'ZENNNN покажет свои воз&shy;мож&shy;нос&shy;ти',
        blocks: [
          {
            icon: 'box.svg',
            title: 'Сделки и товары',
            text: 'Сразу создавайте сделку, минуя занесение товара на склад, он появится там автоматически. Вам поможет революционный конструктор сделок.',
          },
          {
            icon: 'group.svg',
            title: 'Сотрудники',
            text: 'Создавайте сотрудников, контролируйте количество сделок у них в работе, назначайте права доступа согласно должностям.',
          },
          {
            icon: 'sigma.svg',
            title: 'Кабинет клиента',
            text: 'Познакомьтесь с тем, как будет выглядеть процесс работы глазами вашего клиента.',
          },
          {
            icon: 'percent.svg',
            title: 'Маржа и комиссия',
            text: 'Устанавливайте процент маржи или комиссии для автоматического рассчета прибыли в больших массивах данных.',
          },
          {
            icon: 'factory.svg',
            title: 'Поставщики',
            text: 'Формируйте свою базу поставщиков с рейтингами и действительно удобной каталогизацией.',
          },
          {
            icon: 'dots-horizontal.svg',
            title: 'Дополнительно',
            text: 'Используйте уже полюбивщиеся функции из других систем, ведь они также доступны в ZENNNN.',
          },
        ],
      },
      userInterface: {
        text: 'Разработана с особой заботой к пользователю',
        blocks: [
          {
            text: 'Темный интерфейс бережет зрение',
          },
          {
            text: 'Простое управление — эффективность и продуктивность при минимуме действий',
          },
          {
            text: 'Показывает KPI сотрудников в режиме реального времени',
          },
          {
            text: 'Полное вовлечение клиентов в работу над заказами',
          },
          {
            text: 'Революционный принцип «one page» — все данные и функции на одном экране',
          },
          {
            text: 'Функция автозаполнения документов — избавит от рутины повторяющихся действий',
          },
          {
            text: 'На разных языках интерфейс выглядит одинаково',
          },
        ],
      },
      player: null,
      isVideoActivated: false,
      isYouTubeIframeAPILoading: false,
      videoId: 'LMFUvAmbwS0',
      activeFeature: 1,
      features: [
        {
          name: 'deals',
          title: 'Сделки',
          text: 'Конструктор накладных создает документы на основе печатных накладных, полученных от поставщика. В рамках сделки может быть неограниченное количество накладных и поставщиков.',
          img: 'deals.png',
          preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAACXBIWXMAABCcAAAQnAEmzTo0AAABlklEQVQoz5WS2W7CMBBF8yEk8ZKFCLI4YZNKQwoKVOKB//+MvtWN8NQz4AjU9qEPR9e547mMGHv7/dvH5XIZ+r7Xr21nafV2u/1Ba/3D4aC7bq93Xaf7fa9Ph6Nud61+P5308Xz+eumPn16cJNfZbA6c85Eoip5USgmMMQjDcITdwXMQBKPvhYwNUTwFIRPDZWwYlyYIfOP7vtWA9D94tmngXIAQ0lhQaZrHiRHn/VYTQpDipB4XfJirOczymalUBVVVQdM0RJ7nUBQFlGVJulgsqI4sl8vxXNc1FGVFwZ7kYqjzEvIyNxRUN7BarQjXgIHIer0GpRQFbDYbUuQWrm6BgvOhLHKcxmDRTYiX8NuFIeijYihO63zqs3qbUPKhWdrAsjB4CcFJULHRTaRUTT6Gujuuhj+urOL/b7ccDjKLIY5jk6YpOPDJWA+SJBnPzkcvyzJSBP0kndLCaMuB78N97fDIZDKhS2maAROR3WL4VHu4S734zG6Bdt34cdcn6BEzbpWNj/gPqN+zyRoPv034D1zv9Rvvgl7fSGrV+gAAAABJRU5ErkJggg==',
          value: 1,
        },
        {
          name: 'goods',
          title: 'Товары',
          text: 'Программа хранит полную информацию о товаре: фото, название, модель, единицу измерения, количество, цену закупки и цену продажи. ZENNNN использует «нестандартную» логику для подобных систем: любая информация, добавленная в нее, всегда под рукой и именно там, где она нужна.',
          img: 'goods.png',
          preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAACXBIWXMAABCcAAAQnAEmzTo0AAAB+klEQVQoz21TbZOaQAzmd6gsCwhK71BQQKeKeIzinO2NM1fnjnp9+f8f+61b5jZNVpZ22vvwTLJ5SPLsJhjb7fbH6XRq9vu9WOeFyPONWK/X/yHPc1GWpSi2pdgUhdiVO3EoK5FvNuJQVaI6Hn+931c/Ddu2Xx3HAbQIruxwOOwsceFkir4HjDGwLOsK9Hl7VvEWhmmaDec2OK4nbWcoue3KwWDQAXnJmIWW/Ym1cZMx5FjLmwqo0GmC2xjcoSdJBWE8HoPv+zAajcDzPGX1WXOcc1THlUJz0G/PFhgWd5un8xkeP9zJeJbAcrGANE1hMpnAdDqFKIqUpfNsNlM+WfoG3xUWyyVUx0eIZ3N8HhuvzKym2pXw5fOTTJIUcAAwn89VogYV0w2ufgjbuxK+fvsOdV0DDhO5CFzXpTdkzfH+Hi71s4ziGBaoMEarlZHVBSmulWZZBkVRKAFRhI3w22tBVFjXL/ByqSUl6OvqglqVvir5SZJ0zcIwhJt3gYqrghZ3moeHE1yeP3VXXq1W6tqUQE2mbXH9hsRRXHOHj2dI0kytmIEjbyL8KEvm0scpBkHQTZImrEE7qf1/uZvbifT9EU1aYkHW9Pt96PV6tEeAe6ZAPoExEzvjoru02FYX/xsDzL/uKyOFTLTbrwJv4cpzYO1f8QZ07utvE9lpiCpoc1oAAAAASUVORK5CYII=',
          value: 2,
        },
        {
          name: 'margin',
          title: 'Маржа',
          text: 'Выберите маржу если к себестоимости товара необходимо назначить процент маржи. Это удобно, если у вашей компании стабильная система наценки. Маржа для всех товаров в сделке рассчитается автоматически.',
          img: 'margin.png',
          preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAACXBIWXMAABCcAAAQnAEmzTo0AAABpElEQVQoz31TTVPCQAzlj7SFobR0S7u7/RBoxSOMR8eDV8/+By+Of9ib68fGvAgdFIbDm6TZ5OUlgVEQBG9hGH4GQegm48A1JnXG1u719cVtd7fst05r7Yyxrl32rrnqOFZJTJel5DZXa2er6qMsy/cRk30xiAkpCgMqC0XWVrTbbamqa8rzBWVZRkopKgotgJ+mqcS1NlTXLec2xIQEwk8QhmHgWa3PlPLc3cfxzM/nc89FgwWUgp17JpR4URTeGOOtteyXfiAEGSw6K5WLijzPBfD/4/gNSvN9/CzhdDol7kqTSUSz2Yw0+6yaFouFjHUJJ4Q8hgCP7fKamqblHdVsG6qqaihEg2MifEPxCaEs2lgqSk2PT890d/9A6/WKNpsbxkYKL+HoKCGOIir6vhNVucpkTF78oA4+1sFHEAsSWLwh94QQCpGMBSdJKuMnSTIs//doavg+AHl4O3sUHAIkh6TDXsfjMfLOQcRA1B/CKIqo6zparVZ/0Pe9AI32hbSvGXyQwYLQHY8cx/GgCj6a4Gd0+GfAIo4JsM99zKMZ533/ALwrY3/gM3+yAAAAAElFTkSuQmCC',
          value: 3,
        },
        {
          name: 'commission',
          title: 'Комиссия',
          text: 'Выберите комиссию если вы Дилер или Агент и укажите процент дилерской скидки. Система рассчитает себестоимость всех товаров автоматически. Любые цены можно менять вручную выключив режим «Для всех товаров».',
          img: 'commission.png',
          preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAACXBIWXMAABCcAAAQnAEmzTo0AAABv0lEQVQoz21TTXPaQAzlh2BDAIO/9sM2BmzPcGmYSXLs9NBLz/0RPbb9wb1lQ7uKnsJ6QsrhjbRa6UlvZU+iKPoTx/E5imJ3N4/c1m6ctbX7/eune3h8cqZqnTGGY9a1+8Ftd72zVS0xozX7Dcc6V9fNi9b6ecJkfxnEhDSLI9Iqp6qq6HS6p7ppqChKyrKM8jwnpQ0pZcTfbDYcT4mJqdm21DQtMSGB8AxChudpfZblnpP8Kkl8mqZ8zkYL5GJTz4QSV0p5Y623thJ/JAQZLDpjAqAoCgF8TBn8W3dBxRUhQy4wOmQXRU6LxUIKEVsulyxZiQ/AtywZuSH2YUIQ5qQ5CW8zHD/x22wlsa7rKzKAJRMvjXgxckbj/whTTGgslUrTt+8/6POXr9R3BzoejwJzaRYmRG4YAPi4FJlkGAba73ZUsuSyLKSw4Y3zpzOStW0rUkMM9taW5Q1xWZalLAhYr9fjAiATQBPkhjN85N7ccpIkQoJEnEPRfD5HnmA6nY5+WCjsFeFsNqO+7+lwOIzouk6eAHE0QuFF0ZUPhbAgdO8loyhMtFqtCE3wubz9GW+yEIcCvNkl5lHHef9eARuDY8AZBRYJAAAAAElFTkSuQmCC',
          value: 4,
        },
        {
          name: 'supplier',
          title: 'Поставщики',
          text: 'Все важные данные в одном месте — информация о поставщике, адреса и телефоны розничных магазинов, складов, дополнительных офисов, банковские реквизиты. Функция автоподставления сама заполнит большую часть документов.',
          img: 'supplier.png',
          preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAACXBIWXMAABCcAAAQnAEmzTo0AAABlklEQVQoz21T2W7CQAzMjyTkApEDSAjHS9hASkSlVqL//xV967ZRd+tx4whoH0a2Z9fj8UZxTqfT+/X69tV1nT6oRiul9KGudf0ApQ66bVutmqNujkfdtR1DNUo/Xy76/PL6WT+dP5wgCL7DMLQUCb5N0swWZWXDMLJxHBMX2iiKrO/7djKZ3MEfoud5I+d4ntsH1BxGMxNEU4Po+4FxXXcENdzVI4j3BvzWriFBr4cLcmQQSYzdRvGMuJgGTdkJHP6Hyc0ZnDqU9IvFwi6XS0Owq9XKZllGyMFxvhoiaiBJEq7zPL+LEMUb9mVZ2t1uZzabjS2KggFhieDX6zVH3AVXVRXXkgP4FuxwaDK4LBPBQQQ5IsQRwYNDLffFBJ7KoTfoBwEjK6VpymtJlHx4Gq7RA24+nzOPelwZk7EyJt6uizUgAB7YbrfMg8MZ7kHsz8pQpwMD+4+u5AMIHs/gkHLuJXOGBTFVPgrcyurgxYE4RASHe8jFLdWGHZLqJw73+72RB5cGGsINEEItK8v5zdc3iPjrfgDvk2lM8+M3OQAAAABJRU5ErkJggg==',
          value: 5,
        },
        {
          name: 'staff',
          title: 'Сотрудники',
          text: 'Система позволяет создавать новых сотрудников, отслеживать их KPI в режиме реального времени и контролировать уровень доступа. ZENNNN умнее многих систем. Например, клиент-менеджеры имеют полный доступ к информации только тех клиентов, которых создали сами. Это защищает вашу клиентскую базу от полного копирования или кражи после увольнения сотрудника.',
          img: 'staff.png',
          preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAACXBIWXMAABCcAAAQnAEmzTo0AAACLElEQVQoz3VT2XLbMAzUh9QSSdnWTd2y7FiXJSVp0k762P//g75V1YQowNietjN92FnwWi4A0uj7/sfb29s6z/PStB2iXc7ns0ZzZR03zTKO49L1A6JbHsfHZRqmpeu65fPT03J5/fLrPFx+GpzzdyEEIN9h2zZst1tIswIcxwUhODDGwLKsO5hpArvGJsYWAWNjs9msnNvA7Z3iYqsYtxXOqY1pKsaEMk3rY/xffPprbKD6aqMb294qodkGwQXcXBP/G99B2VzP0Do5NRhna5SEEIWRCuMAZCxBSglJkkAcxxq3uCgKzWEYQppmEAQ+dOMLHOoTxgEwFDUE42sZJSCTWGUyhjxNcXMKeZ5rzrJMx8R1XWtxuvBwOOB6gmJnKMsKjcTapcEZW2NUx1uVJ32I4ghkJO8Hbw6jKMKDpWbf9yFHt0kSo8NXKKsaPM/HxqGgxax15zvge77ysKPI4HoubvDuoHQcx7mXYL/f63mJGe13W3wRNjhuABa+BO0w/BBQno+Hw0A7oDqREIFckQClTYIkTnO6npgN7XddVz8tQwi2pimmHEQqQJYppinjP5qSYJxqN5QyzdNlVNcQm/L89Ts8NL0KUBRrqAwu+JrXBVRFpYjLQwkVFpmKTgJVVWIzCs3H41E3hsSOpxOUWMf5+Ru03UDuFT0lwxZiGS8j4NdT8zQDfi+YponG0PU9DG0DL8MDXIZez9F627aa8dvC6VjTWDVNS+/x/TcL528YpN3NHwAAAABJRU5ErkJggg==',
          value: 6,
        },
      ],
      activeAdvanceFeature: 2,
      advanceFeatures: [
        {
          name: 'photos',
          title: 'Фотоотчеты',
          text: 'Фотоотчеты нужны клиенту, чтобы понять состояние приобретаемого товара. Храните все фотоотчеты в одном месте и делитесь ими с клиентами.',
          img: 'photos.png',
          preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAACXBIWXMAABCcAAAQnAEmzTo0AAAC9ElEQVQozzVTTU8TURSdn2GgFKSlnXamnelMPyilhRZKBCShFaQKVMFSQAXCR7WBCBFEqhhBrIhoJMG4MTHE6MJoNDG6wo0mJu78BW6NZtR3vDPYxcmddzPvvPvOOY+zWq0/rFbLb4vFoumgtVF5ntfcbrcmCE7N6XRSFTRRFLW6YFBTVdXoSaKkiYKomSvNmtls4BdHP0EUXXAKIhwOBwSqTqcAo+9yU18w+jr0b71PZAc9pwN0MMrKygxUVFSAU7wBpvpqmaL6mSRJVL1M9fqZLEssFFBYKFjL6sNhFiY0NcVZNBpjwWCQ+f1+A4EA7VcUA1VVVYwjIngUHyTZA7ckQfYoIEL4fV70pZJIdLRgNJ3ERLYfpwbTGMpmMHwmjVgsiuamJoTDEUQaGtHQGEV1dTU4mg6+QIhIApCJVFF98KheNITDSPWl0N7ZgUuzF5C/mMPU5BhmRk9j8XwvutuisDkEZAd6MZ7pRbI5AEv1YXAu0snllkgT3oBHn5BIFUWBQBrlJsfxdf8tPj5/iP3HV/Hh0TJ2i0voTrSiMH0SX56sYKeQw/RgF2osNGFJYJ53/DdFgMvlgovELys30bW78OnFNr69eYC9nRvIL8xjebWAz0+v4ee7DbzfXcbO1i1sb6yipsYKzm63G84aJAQyxqgUGdjtPFpaSMORDC4v5NE/fA7J9CD2tq/g++siXt2dxebaMh7cWUN+ahwO3k4aqqqxWYc+nVtSDHP0tY0XkEgkcL2wiOLaCuLxKEJ1Pjxbn8HL4hwZdgTzcznsbq1jdWkOvN0GTrddn0qWZaOWQLGB1cajp6cbm8WbmJg4i7r6IA5R3qLk8LHEURw/0YNpmuz+7VV2b72gX5kZVyawUngP9OT1HswU1FisEZmhAXQmOtAcj8HjVeEPhdHa3oYUEY5kBzA9Poqx0SFGrwwcEfwxmUx6ypme9BLoGaG8vBw2m42clxEKhShrDZS5CCjQiEQilMF6SoMHHnoEBFRWVv79B3J6sZ50ek3sAAAAAElFTkSuQmCC',
          value: 1,
        },
        {
          name: 'notifications',
          title: 'Ав&shy;то&shy;ма&shy;ти&shy;чес&shy;кие уведомления',
          text: 'Помогают планировать работу, держат в курсе событий и предупреждают о неприятностях.',
          img: 'notifications.png',
          preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAACXBIWXMAABCcAAAQnAEmzTo0AAABf0lEQVQoz32S3W6DMAyF9yBtLwuE8BNIoIyyn15UU9//VSZNbIvn4zYRTFUvPiUy9vGxw9Nut/vcbDbfWZbNXdfN1tm5Nc2cKzVrrR9SVZXUOOcEvn89sSBtt1tKkoTyPBeUUpSmivb7hNnfBflFURAbkXyAOwQ9O/Qc8OPL6K21vm0a79yzL8rK57li8ruUZekbzpWathXEIQtSpjJ6/XgjDkonrQtxm6apuLkHjyz5LBqJI6PQ1IaMMfKhNh03UXGcyG0laBYEl6x2qAvNzrQkL3cT4VhwBwPYYRAPdXFkflWahiNZ51ZjwHF0zY6CuDisaxrHkfq+J35l4ldeCHL3926i1lrSnLzcVdgjTji/omTk45FNcA0/ENXcYLVD2127HA4HGoZBzv/ADSaAGIAYYiA49DdBX5WV7AVgJzhRhO7C8i5AtESOv+XF38ZjjOAA4I7uGOMRpmlDIxGF4A92yI785XKh8/lMp9NJzmmaVv/YPfphYtHG17WI/v4B+IVuHbcv/0UAAAAASUVORK5CYII=',
          value: 2,
        },
        {
          name: 'client-card',
          title: 'Карточка клиента',
          text: 'Заполняется один раз, хранит всю информацию о клиенте и автоматически использует данные везде, где они необходимы.',
          img: 'client-card.png',
          preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAACXBIWXMAABCcAAAQnAEmzTo0AAABsUlEQVQoz21T7Y6bMBDkQWISQj4xBJPwESmB6FBVTlcpff8HqVS5rbc7S0250/2Y7MaeHc/aS9C27Y/n8/lrGAbbdg/btp2932/2drtxvEsEmGf7vrfd44XR2aH/al8kf9hXru3fvtlr2/0MVqsVLZfL/whDiuOYoiia4nq9JvBC3pvzEMNwOa7/+x9wgcvz3J1OJ5dlmeS84RaLhVNKSfT5R3y2F0DVGENN01BVVZSmKe12O8Fms6HtdiuAwzmiVSSc/X4vMY7X4jTAT1EU1NQ1FaYQQXYqmOc49Hw+CxcweT5xLpeSyqoZBeFQJ1o2kiShw+HIOLwD1vlKJkBIa03H45Ed7qg4V/Rl+E6hUhSohaLr/Up1U/OpBRcYJh6EDHhBuIJDj8vcLbuHIXkU2MxNLsgyM4nMoXVC/FhSCB5ilmZyEAC3wCRY5Ibv4cJkM7bFLUEgZdIoqEdXzEHEnm/ZA8IiqELlrnwHdVk5nerpNI/RhaaaHw2Yt+lzBsYOgm5smWevLEtxACD3gCOQUThfx4j5HDWYY9/yb4wAFzo/FmjpI+T+OEL8k318FHD45y81j2oO3tEaCwAAAABJRU5ErkJggg==',
          value: 3,
        },
      ],
      activeReview: 1,
      reviews: [
        {
          author: 'Willam Henry',
          position: 'Developer CEO',
          avatar: 'avatar.png',
          text: 'Многие думают, что Lorem Ipsum - взятый с потолка псевдо-латинский набор слов, но это не совсем так. Его корни уходят в один фрагмент классической латыни 45 года. так. Его корни уходят в один фрагмент классической латыни 45 года',
        },
        {
          author: 'Willam Henry',
          position: 'Developer CEO',
          avatar: 'avatar.png',
          text: 'Многие думают, что Lorem Ipsum - взятый с потолка псевдо-латинский набор слов, но это не совсем так. Его корни уходят в один фрагмент классической латыни 45 года. так. Его корни уходят в один фрагмент классической латыни 45 года',
        },
      ],
      team: [
        {
          name: 'Михаил Болтенков',
          position: 'CEO, экономист, сооснователь ZENNNN',
          country: 'ru',
        },
        {
          name: 'Игорь Иванов',
          position: 'CTO, программист, сооснователь ZENNNN, бэк-энд разработчик',
          country: 'ru',
        },
        {
          name: 'Анна Маловичко',
          position: 'супервумен, экономист, маркетолог',
          country: 'ua',
        },
        {
          name: 'Степан Сотников',
          position: 'программист, fullstack, техлид',
          country: 'ru',
        },
        {
          name: 'Владимир Борисов',
          position: 'программист, фронт-энд разработчик',
          country: 'ru',
        },
        {
          name: 'Никита Ермолаев',
          position: 'программист, фронт-энд разработчик',
          country: 'ru',
        },
        {
          name: 'Олег Дубровский',
          position: 'дизайнер, видео-дизайн',
          country: 'ua',
        },
        {
          name: 'Юрий Сухарук',
          position: 'советник по таможенному оформлению',
          country: 'ru',
        },
        {
          name: 'Александр Мурзак',
          position: 'дизайнер, UI/UX дизайн',
          country: 'ua',
        },
        {
          name: 'Светлана Щербакова',
          position: 'дизайнер, UI/UX дизайн',
          country: 'ru',
        },
        {
          name: 'Денис Кольцов',
          position: 'маркетолог',
          country: 'ru',
        },
        {
          name: 'Маргарита Митрофанова',
          position: 'маркетолог',
          country: 'ru',
        },
        {
          name: 'Галина Петрова',
          position: 'советник по бухгалтерии и налогам',
          country: 'ru',
        },
        {
          name: 'Александр Проскурин',
          position: 'экономист, советник по бизнес-вопросам',
          country: 'ru',
        },
        {
          name: 'Максим Подсевалов',
          position: 'инженер, тайный советник',
          country: 'ru',
        },
        {
          name: 'Александра Игнатович',
          position: 'филолог, тайный советник',
          country: 'ru',
        },
        {
          name: 'Ли Цзянь И',
          position: 'экономист, советник по Китаю',
          country: 'cn',
        },
        {
          name: 'Чжан Цин Цин',
          position: 'экономист, менеджер',
          country: 'cn',
        },
        {
          name: 'Кэран Хо',
          position: 'переводчик, китайский',
          country: 'cn',
        },
        {
          name: 'Тино Картер',
          position: 'переводчик, английский',
          country: 'us',
        },
        {
          name: 'Бенуар Ожэ',
          position: 'переводчик, французский',
          country: 'fr',
        },
      ],
    }
  },
  computed: {
    infoAlertStyle () {
      const val = `translateY(${this.infoAlertTop}px)`
      return { '-webkit-transform': val, '-ms-transform': val, transform: val }
    },
  },
  watch: {
    isScrollingUp () {
      this.savedScroll = this.savedScroll || this.currentScroll
    },
  },
  mounted () {
    if (process.env.NODE_ENV === 'production') {
      if (window.YT) {
        this.onYouTubeIframeAPIReady()
      } else {
        this.loadYouTubeIframeApi()
      }
    }
    window.addEventListener('scroll', this.onScroll, { passive: true })
    if (this.$route.hash === '#video') {
      this.goTo(0)
    }
  },
  beforeUnmount () {
    if (this.player) {
      this.player.destroy()
    }
    window.removeEventListener('scroll', this.onScroll, { passive: true })
  },
  methods: {
    onScroll () {
      let scrollY = window.pageYOffset || 0
      if (scrollY < 0) {
        scrollY = 0
      }
      if (this.isInfoAlertActive) {
        let infoAlertTop = INFO_ALERT_TOP - scrollY
        infoAlertTop = infoAlertTop < 8 ? 8 : infoAlertTop
        this.infoAlertTop = infoAlertTop
      }
      this.previousScroll = this.currentScroll
      this.currentScroll = scrollY
      this.isScrollingUp = this.currentScroll < this.previousScroll
      this.currentThreshold = Math.abs(this.currentScroll - SCROLL_THRESHOLD)
      this.$nextTick(() => {
        if (
          Math.abs(this.currentScroll - this.savedScroll) > SCROLL_THRESHOLD
        ) {
          if (this.isScrollingUp) {
            // TODO
          }
          this.savedScroll = this.currentScroll
        }
      })
    },
    goTo (index) {
      const nav = this.navItems[index]
      const id = nav ? `#${nav.sectionId}` : null
      if (id) {
        document.querySelector(id).scrollIntoView()
      }
    },
    playVideo () {
      this.isVideoActivated = true
      try {
        this.player.playVideo()
      } catch (error) {
        // eslint-disable-next-line
        console.warn('Video play error: ', error)
      }
    },
    loadYouTubeIframeApi () {
      if (window.YT || this.isYouTubeIframeAPILoading) {
        return Promise.resolve()
      }
      return new Promise((resolve, reject) => {
        this.isYouTubeIframeAPILoading = true
        window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady
        // This code loads the IFrame Player API code asynchronously.
        const script = document.createElement('script')
        script.src = 'https://www.youtube.com/iframe_api'
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(script, firstScriptTag)
        // defines the callback that resolves on successful load
        script.onload = () => {
          this.isYouTubeIframeAPILoading = false
          resolve()
        }
      })
    },
    onYouTubeIframeAPIReady () {
      // This function creates an <iframe> (and YouTube player)
      // after the API code downloads.
      this.player = new window.YT.Player('ytplayer', {
        height: '1000',
        width: '562',
        videoId: this.videoId,
        playerVars: {
          rel: 0,
          controls: 1,
          modestbranding: 1,
          showinfo: 0,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: this.onPlayerReady,
        },
      })
    },
    onPlayerReady (event) {
      // prepare video to immediate play start
      event.target.seekTo(0, true)
      event.target.pauseVideo()
    },
  },
}
</script>

<style lang="postcss" scoped>
.about-info-alert {
  will-change: transform;
  transition: transform .2s cubic-bezier(.4,0,.2,1);
}
.about-info-alert__container {
  padding-left: 4px!important;
}
.about-info-alert__content {
  background: #FFF2AD;
  min-height: 48px;
}

.about-video .about-video__play circle {
  will-change: opacity;
  transition: opacity 0.1s cubic-bezier(0.61, 1, 0.88, 1);
}
.about-video:hover .about-video__play circle {
  opacity: .35;
}
.about-imac {
  top: 114px;
  left: 60%;
  right: 0;
  height: 725px;
}
.about-head-title {
  font-size: 20px;
  line-height: 32px;
}
.about-head-subtitle {
  font-size: 58px;
  line-height: 71px;
}
.about-section-title {
  font-size: 46px;
  line-height: 56px;
}
.about-section-gradient {
  background: linear-gradient(180deg, #F4F4F4 0%, rgba(244, 244, 244, 0) 100%);
}
.about-section-bg {
  background: #F8F8F8;
}

.about-devices {
  left: 0;
  top: 0;
  right: 0;
  margin-left: 16px;
  margin-bottom: 48px;
  height: 555px;
}
.about-saas {
  max-width: 160px;
  z-index: 1;
}
.about-saas > img {
  filter: drop-shadow(8.6px 8.6px 50px rgba(0, 0, 0, 0.1));
  transform: translateZ(0);
}
.about-iphone {
  filter: drop-shadow(-20px 10px 40px rgba(0, 0, 0, 0.25));
  transform: translateZ(0);
}
.about-huawei {
  filter: drop-shadow(0px 4px 50px rgba(0, 0, 0, 0.25));
  transform: translateZ(0);
}

.about-footer {
  background: #F2F2F2;
}

@screen sm {
  .about-head-title {
    font-size: 26px;
  }
}
@screen md {
  .about-saas {
    left: 60%;
    max-width: unset;
  }
  .about-devices {
    left: 60%;
    top: 58px;
    margin-left: 92px;
    margin-bottom: 0;
  }
}
@screen lg {
  .about-imac__wrapper {
    height: 540px;
  }
  .about-saas,
  .about-devices {
    left: 50%;
  }
  .about-devices {
    margin-left: 82px;
  }
}
@screen xl {
  .about-imac {
    left: 57%;
  }
  .about-cloud-lock {
    right: -40px;
  }
  .about-info-alert__container {
    padding-left: 28px!important;
  }
}
@media (min-width: 1366px) {
  .about-cloud-lock {
    right: -60px;
  }
}

.text-22 {
  font-size: 22px;
}
.rounded-10 {
  border-radius: 10px;
}
.rounded-12 {
  border-radius: 12px;
}

.shadow-medium {
  box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.08);
}
.shadow-large {
  box-shadow: 20px 50px 60px rgba(0, 0, 0, 0.15);
}
.shadow-outline {
  box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.1);
}
</style>
