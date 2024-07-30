const state={allItems:[],currentPage:1,itemsPerPage:12,selectedTypes:[],selectedStatus:"all",sortPrizeOrder:"asc",sortDateOrder:"asc"};let config={};const loadConfig=async()=>{try{let e=await fetch("./configs/sagovConfig.json");config=await e.json(),state.itemsPerPage=config.itemsPerPage}catch(t){console.error("Failed to load config:",t)}},showLoader=()=>{document.getElementById("loader").style.display="block"},hideLoader=()=>{document.getElementById("loader").style.display="none"},fetchItems=async()=>{if(showLoader(),config.useGoogleSheets)try{let e=await fetch(config.GoogleSheetsURL),t=await e.text(),a=csvToJson(t);state.allItems=a,hideLoader()}catch(s){console.error("Error fetching or converting CSV:",s),hideLoader()}else try{let r=await fetch(config.localJsonPath),l=await r.json();state.allItems=l,hideLoader()}catch(o){console.error("Error fetching local JSON:",o),hideLoader()}},csvToJson=e=>{let t=e.split("\n").filter(e=>e.trim()),a=t[0].split(",").map(e=>e.trim());return t.slice(1).map(e=>{let t=[],s,r=/(?:^|,)(?:"([^"]*)"|([^",]*))/g;for(;null!==(s=r.exec(e));){let l=void 0!==s[1]?s[1]:s[2];t.push(l.trim())}let o={};return a.forEach((e,a)=>{o[e]=void 0!==t[a]?t[a]:""}),o})},filterItems=()=>{let{allItems:e,selectedTypes:t,selectedStatus:a}=state;return e.filter(e=>{let s=document.getElementById("searchInput").value.toLowerCase(),r=["title","location","description","type"].some(t=>e[t]&&e[t].toLowerCase().includes(s)),l=0===t.length||t.includes(e.type),o="all"===a||e.status===a;return r&&l&&o})},updateDisplay=()=>{let e=document.getElementById("item_card_container");e.innerHTML=filterItems().map(e=>generateItemCardHTML(e)).join(""),toggleResetButton(),AOS.init({once:!1})},toggleSortByDate=()=>{state.sortDateOrder="asc"===state.sortDateOrder?"desc":"asc",console.log("Toggled sort order to:",state.sortDateOrder),sortItemsByDate(state.sortDateOrder)},sortItemsByDate=e=>{console.log("Sorting by date in order:",e),state.allItems.sort((t,a)=>{let s=new Date(t.date),r=new Date(a.date);return"asc"===e?s-r:r-s}),updateDisplay()},toggleSortByPrize=()=>{state.sortPrizeOrder="asc"===state.sortPrizeOrder?"desc":"asc",document.getElementById("sortIcon").classList.toggle("ti-sort-ascending","asc"===state.sortPrizeOrder),document.getElementById("sortIcon").classList.toggle("ti-sort-descending","desc"===state.sortPrizeOrder),sortItemsByPrize(state.sortPrizeOrder)},sortItemsByPrize=e=>{state.allItems.sort((t,a)=>{let s=parseInt(t.prize.replace(/[\$,]/g,"")),r=parseInt(a.prize.replace(/[\$,]/g,""));return"asc"===e?s-r:r-s}),updateDisplay()},generateItemCardHTML=e=>{let t=t=>e[t]||"";return`
  <div data-aos="fade-up" data-aos-duration="500" data-aos-anchor-placement="bottom" class="flex flex-col justify-center w-full mb-6">
    <div
      class="relative flex flex-col lg:flex-row space-x-0 lg:space-x-5 space-y-3 lg:space-y-0 rounded-box shadow-lg p-3 max-w-xl lg:max-w-7xl mx-auto border border-gray-700/70 bg-base-100">
      <div class="w-full lg:w-1/3 flex justify-center lg:h-auto lg:min-h-[15rem]">
        <img src="${t("image")}" alt="item_image_${t("id")}"
          class="rounded-box border-solid border-[3px] border-base-100 shadow-2xl w-full lg:w-auto lg:max-h-[17rem] h-auto object-cover" />
      </div>
      <div class="w-full lg:w-2/3 flex flex-col space-y-2 p-2">
        <div class="pb-2">
          <div class="flex justify-between item-left">
            <p class="text-primary font-bold">${t("type")}</p>
            
          </div>
          <h3 class="font-black text-primary md:text-3xl text-xl mb-2">
            ${t("title")}
          </h3>
          <p class="text-base">
            ${t("description")}
          </p>
        </div>

        <div class="flex flex-wrap justify-between items-center gap-3">
          <p class="flex-grow text-sm border bg-primary/5 border-primary px-3 py-2 rounded-lg">
          📆&nbsp;${t("date")}
          </p>
          <p class="flex-grow text-sm border bg-primary/5 border-primary px-3 py-2 rounded-lg">
          🕔&nbsp;${t("time")}
          </p>
          <p class="flex-grow text-sm border bg-secondary/5 border-secondary px-3 py-2 rounded-lg">
          📍&nbsp; ${t("location")}
          </p>
        </div>
      </div>
    </div>
  </div>
    `},updatePagination=()=>{let{currentPage:e,itemsPerPage:t,allItems:a}=state,s=(e-1)*t,r=s+t,l=filterItems().slice(s,r),o=document.getElementById("item_card_container");o.innerHTML=l.map(e=>generateItemCardHTML(e)).join(""),window.scrollTo({top:0,behavior:"smooth"}),AOS.init({once:!1})},attachPaginationEventListeners=()=>{document.getElementById("nextPage").addEventListener("click",()=>{state.currentPage++,updatePagination()}),document.getElementById("prevPage").addEventListener("click",()=>{state.currentPage>1&&(state.currentPage--,updatePagination())})},attachEventListeners=()=>{document.getElementById("searchInput").addEventListener("input",updateDisplay),document.querySelectorAll(".itemType").forEach(e=>{e.addEventListener("change",e=>{let t=state.selectedTypes.indexOf(e.target.value);e.target.checked?-1===t&&state.selectedTypes.push(e.target.value):-1!==t&&state.selectedTypes.splice(t,1),updateDisplay()})}),document.querySelectorAll(".statusFilter").forEach(e=>{e.addEventListener("change",e=>{state.selectedStatus=e.target.value,updateDisplay()})}),document.getElementById("toggleSortDate").addEventListener("click",toggleSortByDate),document.getElementById("toggleSortPrize").addEventListener("click",toggleSortByPrize);let e=document.getElementById("resetFilters");e.addEventListener("click",resetFilters)},resetFilters=()=>{state.selectedTypes=[],state.selectedStatus="all",document.querySelectorAll(".itemType").forEach(e=>e.checked=!1),document.getElementById("allStatus").checked=!0,updateDisplay(),toggleResetButton()},toggleResetButton=()=>{let e=document.getElementById("resetFilters");state.selectedTypes.length>0||"all"!==state.selectedStatus?e.style.display="block":e.style.display="none"},initialize=async()=>{await loadConfig(),await fetchItems(),attachEventListeners(),attachPaginationEventListeners(),updatePagination(),toggleResetButton()};initialize();