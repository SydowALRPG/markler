const state={allItems:[],selectedTypes:[],selectedAvailability:"all"};let config={};const loadConfig=async()=>{try{let e=await fetch("./configs/teamConfig.json");config=await e.json()}catch(t){console.error("Failed to load config:",t)}},showLoader=()=>{document.getElementById("loader").style.display="block"},hideLoader=()=>{document.getElementById("loader").style.display="none"},fetchItems=async()=>{if(showLoader(),config.useGoogleSheets)try{let e=await fetch(config.GoogleSheetsURL),t=await e.text(),a=csvToJson(t);state.allItems=a,hideLoader()}catch(l){console.error("Error fetching or converting CSV:",l),hideLoader()}else try{let r=await fetch(config.localJsonPath),s=await r.json();state.allItems=s,hideLoader()}catch(i){console.error("Error fetching local JSON:",i),hideLoader()}},csvToJson=e=>{let t=e.split("\n").filter(e=>e.trim()),a=t[0].split(",").map(e=>e.trim());return t.slice(1).map(e=>{let t=[],l,r=/(?:^|,)(?:"([^"]*)"|([^",]*))/g;for(;null!==(l=r.exec(e));){let s=void 0!==l[1]?l[1]:l[2];t.push(s.trim())}let i={};return a.forEach((e,a)=>{i[e]=void 0!==t[a]?t[a]:""}),i})},filterItems=()=>{let{allItems:e,selectedTypes:t,selectedAvailability:a}=state;return e.filter(e=>{let l=["name","description","role"].some(t=>e[t].toLowerCase().includes(document.getElementById("searchInput").value.toLowerCase())),r=0===t.length||t.includes(e.type),s="all"===a||e.availability===a;return l&&r&&s})},updateDisplay=()=>{let e=document.getElementById("item_card_container");e.innerHTML=filterItems().map(e=>generateItemCardHTML(e)).join(""),toggleResetButton(),AOS.init()},sortItemsByPrice=e=>{state.allItems.sort((t,a)=>{let l=parseFloat(t.price.replace(/[^0-9.]/g,"")),r=parseFloat(a.price.replace(/[^0-9.]/g,""));return"asc"===e?l-r:r-l})},generateItemCardHTML=e=>{let t=t=>e[t]||"";return`
  <div data-aos="fade-up" data-aos-duration="500" class="flex flex-col rounded-xl p-4 md:p-6 shadow-lg card border-[3px] border-base-200 bg-base-100 relative">
  <div class="flex justify-between">
    <div class="flex flex-col w-full">
      <div class="flex items-center gap-x-4">
        <img class="rounded-full w-20 h-20 border-2 border-gray-700/70" src="${t("image")}" alt="item_image_${t("id")}">
        <div class="grow">
          <h3 class="font-medium text-primary">${t("name")}</h3>
          <p class="text-xs uppercase text-gray-500">${t("role")}</p>
        </div>
      </div>
      <p class="mt-3 text-gray-500">${t("description")}</p>
      <div class="flex space-x-1 w-full justify-between mt-5">
        <div
          class="inline-flex justify-center items-center w-4/5 h-8 text-sm font-semibold rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
          📱 ${t("phone")}</div>
        <a class="inline-flex justify-center items-center w-8 h-8 text-sm font-semibold rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          href="${t("discord")}">
          <img class="w-4 h-4" src="./assets/img/discord.svg" alt="discord">
        </a>
      </div>
    </div>
  </div>
  <p class="absolute top-0 right-0 mt-8 mr-8">${t("availability")}</p>
</div>
    `},attachEventListeners=()=>{document.getElementById("searchInput").addEventListener("input",updateDisplay),document.querySelectorAll(".itemType").forEach(e=>{e.addEventListener("change",function(e){e.target.checked?state.selectedTypes.push(e.target.value):state.selectedTypes.splice(state.selectedTypes.indexOf(e.target.value),1),updateDisplay()})}),document.querySelectorAll(".availability").forEach(e=>{e.addEventListener("change",function(e){state.selectedAvailability=e.target.value,updateDisplay()})}),document.querySelectorAll(".sortbyPrice").forEach(e=>{e.addEventListener("change",function(e){sortItemsByPrice(e.target.value),updateDisplay()})})},resetFilters=()=>{state.selectedTypes=[],state.selectedAvailability="all",document.querySelectorAll(".itemType").forEach(e=>{e.checked=!1}),document.getElementById("allAvailability").checked=!0,updateDisplay(),toggleResetButton()},toggleResetButton=()=>{let e=document.getElementById("resetFilters");state.selectedTypes.length>0||"all"!==state.selectedAvailability?e.style.display="block":e.style.display="none"},initialize=async()=>{await loadConfig(),await fetchItems(),attachEventListeners(),updateDisplay(),toggleResetButton()};initialize();