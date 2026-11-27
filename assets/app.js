const KEV_URLS = [
  { label: "jsDelivr CISA mirror", url: "https://cdn.jsdelivr.net/gh/CISAGov/kev-data@develop/known_exploited_vulnerabilities.json" },
  { label: "GitHub CISA mirror", url: "https://raw.githubusercontent.com/CISAGov/kev-data/develop/known_exploited_vulnerabilities.json" },
  { label: "CISA official feed", url: "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json" }
];
const $ = (id) => document.getElementById(id);
let kevItems = [];
let lang = localStorage.getItem("kgt-lang") || "en";

const translations = {
  en: {
    workspace:"WORKSPACE", overview:"Overview", vulnerabilities:"Vulnerabilities", alerts:"Security alerts", sources:"Intelligence sources", iraqWatch:"Iraq Cyber Watch", methodology:"Methodology",
    systemOperational:"System operational", publicFeeds:"Public data feeds", liveMonitoring:"LIVE MONITORING", globalThreatMonitor:"GLOBAL THREAT MONITOR",
    dashboardTitle:"Cyber threat intelligence,<br>in one place.", dashboardSubtitle:"Monitor exploited vulnerabilities and security advisories from trusted public sources.",
    publicIntel:"PUBLIC INTELLIGENCE", waitingForData:"Waiting for data…", threatSnapshot:"THREAT SNAPSHOT", securityOverview:"Security overview", refreshData:"Refresh data",
    knownExploited:"Known exploited CVEs", cisaCatalog:"CISA KEV catalog", recentAdditions:"Recent additions", last30Days:"Added in the last 30 days",
    criticalItems:"Ransomware-linked CVEs", fromLoadedCves:"Flagged in CISA KEV records", dataSources:"Linked sources", publicSources:"Sources listed in this dashboard",
    exposureWatch:"EXPOSURE WATCH", exploitedVulnerabilities:"Known exploited vulnerabilities", exploitedDescription:"Vulnerabilities listed by CISA as exploited in the wild.",
    openCisa:"Open CISA ↗", searchPlaceholder:"Search CVE, vendor or product…", allVendors:"All vendors", cveId:"CVE ID", vendorProduct:"VENDOR / PRODUCT",
    vulnerabilityName:"VULNERABILITY", dateAdded:"DATE ADDED", dueDate:"DUE DATE", loadingIntel:"Loading intelligence feed…", cisaFootnote:"Source: CISA Known Exploited Vulnerabilities catalog.",
    priorityFeed:"PRIORITY FEED", securityAlerts:"Security alerts", verifiedSource:"Verified source", cisaAlertTitle:"CISA exploited vulnerability catalog",
    cisaAlertDesc:"Prioritize remediation for vulnerabilities known to be exploited.", nvdAlertTitle:"NVD vulnerability intelligence",
    nvdAlertDesc:"Use CVSS and CVE records to assess technical severity.", scopeNotice:"Scope note",
    scopeText:"This starter dashboard displays public vulnerability intelligence. It does not identify live victims, verify active intrusions, or execute scans.",
    intelNetwork:"INTELLIGENCE NETWORK", sourceHealth:"Source health", openData:"Open data", exploitedCatalog:"Known exploited vulnerabilities",
    connecting:"Connecting", planned:"Planned", vulnerabilityDatabase:"National Vulnerability Database", adversaryTactics:"Adversary tactics and techniques",
    threatIndicators:"Open threat indicators", openSource:"Open source ↗", apiKeyRequired:"API key required", sourceNote:"NVD and MITRE are linked as public references. Automated AlienVault OTX ingestion requires a server-side API key; no secret is stored in this public website.",
    iraqIntel:"IRAQ CYBER INTELLIGENCE", iraqWatchTitle:"Iraq Cyber Watch", iraqWatchDesc:"Official Iraqi cybersecurity notices and public digital-safety resources.", nationalSources:"National sources", nccName:"National Cybersecurity Center of Iraq", nccDesc:"Official national cybersecurity information and advisories", nccAdvisories:"Iraqi security advisories", nccAdvisoriesDesc:"Published alerts, reports and technical guidance", amanName:"AMAN – Digital Protection", amanDesc:"Iraqi public digital-protection platform", visit:"Visit ↗", read:"Read ↗", iraqScopeTitle:"Coverage note", iraqScopeText:"This section links to official Iraqi resources. It does not yet aggregate or independently verify incidents inside Iraq.", transparency:"TRANSPARENCY", methodologyTitle:"Sources & methodology", methodologyDesc:"How this public intelligence dashboard handles information.", connectedData:"Connected data", connectedDataDesc:"CISA KEV is retrieved from its public JSON feed when the page loads. The dashboard shows the source status and refresh time.", externalReferences:"External references", externalReferencesDesc:"NVD, MITRE ATT&CK and Iraqi resources currently open their publishers websites; they are not imported into this dashboard.", editorialRule:"Editorial rule", editorialRuleDesc:"A public advisory is not proof of a local incident. Every future report should include its publisher, publication date and original link.", footerDisclaimer:"Independent project · Data belongs to its respective publishers.", failed:"Both KEV data sources are unavailable — retry later.", loaded:"CISA KEV feed updated", cveDetailEyebrow:"VULNERABILITY INTELLIGENCE", cveLoading:"Loading CVE details from NVD…", cveUnavailable:"NVD details are temporarily unavailable. Open the original CVE record instead.", description:"Description", severity:"Severity", cvssScore:"CVSS score", published:"Published", lastModified:"Last modified", weaknesses:"Weaknesses", references:"References", affectedProducts:"Affected configurations", noDescription:"No description supplied by NVD.", notScored:"Not scored by NVD", noReferences:"No references supplied.", openNvd:"Open NVD record ↗", openCve:"Open CVE.org ↗", close:"Close",
    noResults:"No matching records.", records:"records", cisaConnected:"Connected", cisaFailed:"Unavailable", allCampaigns:"All campaign indicators", ransomwareYes:"Ransomware: Known", ransomwareNo:"Ransomware: Not reported", ransomwareUse:"RANSOMWARE USE", requiredAction:"REQUIRED ACTION", ransomwareKnown:"Known", ransomwareUnknown:"Not reported", actionUnavailable:"No action specified"
  },
  ar: {
    workspace:"مساحة العمل", overview:"نظرة عامة", vulnerabilities:"الثغرات", alerts:"التنبيهات الأمنية", sources:"مصادر الاستخبارات", iraqWatch:"مراقبة العراق السيبرانية", methodology:"المنهجية والمصادر",
    systemOperational:"النظام يعمل", publicFeeds:"مصادر بيانات عامة", liveMonitoring:"مراقبة مباشرة", globalThreatMonitor:"مراقبة التهديدات العالمية",
    dashboardTitle:"استخبارات التهديدات<br>السيبرانية في مكان واحد.", dashboardSubtitle:"تابع الثغرات المستغلة والتحذيرات الأمنية من مصادر عامة موثوقة.",
    publicIntel:"استخبارات مفتوحة", waitingForData:"بانتظار البيانات…", threatSnapshot:"ملخص التهديدات", securityOverview:"نظرة أمنية عامة", refreshData:"تحديث البيانات",
    knownExploited:"ثغرات مستغلة معروفة", cisaCatalog:"كتالوج CISA KEV", recentAdditions:"إضافات حديثة", last30Days:"أضيفت خلال آخر 30 يوماً",
    criticalItems:"ثغرات مرتبطة بالفدية", fromLoadedCves:"وفق مؤشر CISA KEV", dataSources:"المصادر المضافة", publicSources:"مصادر مدرجة في لوحة التحكم",
    exposureWatch:"مراقبة التعرض", exploitedVulnerabilities:"الثغرات المستغلة المعروفة", exploitedDescription:"ثغرات أدرجتها CISA باعتبارها مستغلة فعلياً.",
    openCisa:"فتح CISA ↗", searchPlaceholder:"ابحث عن CVE أو شركة أو منتج…", allVendors:"كل الشركات", cveId:"معرّف CVE", vendorProduct:"الشركة / المنتج",
    vulnerabilityName:"الثغرة", dateAdded:"تاريخ الإضافة", dueDate:"الموعد النهائي", loadingIntel:"جارٍ تحميل موجز الاستخبارات…", cisaFootnote:"المصدر: كتالوج الثغرات المستغلة المعروف لدى CISA.",
    priorityFeed:"موجز الأولوية", securityAlerts:"تنبيهات أمنية", verifiedSource:"مصدر موثوق", cisaAlertTitle:"كتالوج CISA للثغرات المستغلة",
    cisaAlertDesc:"أعطِ أولوية لمعالجة الثغرات المعروفة باستغلالها.", nvdAlertTitle:"استخبارات الثغرات من NVD",
    nvdAlertDesc:"استخدم سجلات CVE ودرجات CVSS لتقييم الخطورة التقنية.", scopeNotice:"نطاق المنصة",
    scopeText:"تعرض هذه النسخة معلومات عامة عن الثغرات. لا تحدد ضحايا مباشرين، ولا تؤكد الاختراقات النشطة، ولا تنفذ عمليات فحص.",
    intelNetwork:"شبكة الاستخبارات", sourceHealth:"حالة المصادر", openData:"بيانات مفتوحة", exploitedCatalog:"الثغرات المستغلة المعروفة",
    connecting:"جارٍ الاتصال", planned:"مخطط لاحقاً", vulnerabilityDatabase:"قاعدة بيانات الثغرات الوطنية", adversaryTactics:"تكتيكات وتقنيات الخصوم",
    threatIndicators:"مؤشرات تهديد مفتوحة", openSource:"فتح المصدر ↗", apiKeyRequired:"يتطلب مفتاح API", sourceNote:"تم ربط NVD وMITRE كمراجع عامة. يتطلب جلب بيانات AlienVault OTX تلقائياً مفتاح API محفوظاً في الخادم؛ لا نضع أي مفتاح سري في موقع عام.",
    iraqIntel:"استخبارات العراق السيبرانية", iraqWatchTitle:"مراقبة العراق السيبرانية", iraqWatchDesc:"الإشعارات العراقية الرسمية ومصادر السلامة الرقمية العامة.", nationalSources:"مصادر وطنية", nccName:"المركز الوطني للأمن السيبراني في العراق", nccDesc:"المعلومات والإشعارات الوطنية الرسمية للأمن السيبراني", nccAdvisories:"الإشعارات الأمنية العراقية", nccAdvisoriesDesc:"تنبيهات وتقارير وإرشادات تقنية منشورة", amanName:"أمان – الحماية الرقمية", amanDesc:"منصة عراقية عامة للحماية الرقمية", visit:"زيارة ↗", read:"قراءة ↗", iraqScopeTitle:"ملاحظة حول التغطية", iraqScopeText:"يربط هذا القسم بالمصادر العراقية الرسمية. لا يجمع أو يتحقق بشكل مستقل من الحوادث داخل العراق حتى الآن.", transparency:"الشفافية", methodologyTitle:"المصادر ومنهجية العمل", methodologyDesc:"كيف تتعامل لوحة الاستخبارات العامة مع المعلومات.", connectedData:"البيانات المتصلة", connectedDataDesc:"يتم جلب CISA KEV من موجز JSON العام عند تحميل الصفحة، وتعرض اللوحة حالة المصدر ووقت التحديث.", externalReferences:"المراجع الخارجية", externalReferencesDesc:"تفتح روابط NVD وMITRE ATT&CK والمصادر العراقية مواقعها الأصلية حالياً، ولا تُستورد بياناتها إلى هذه اللوحة.", editorialRule:"القاعدة التحريرية", editorialRuleDesc:"الإشعار العام لا يثبت وقوع حادث محلي. يجب أن يتضمن كل تقرير مستقبلي الجهة الناشرة وتاريخ النشر والرابط الأصلي.", footerDisclaimer:"مشروع مستقل · البيانات ملك للجهات الناشرة.", failed:"تعذر الوصول إلى مصدري بيانات KEV — أعد المحاولة لاحقاً.", loaded:"تم تحديث بيانات CISA KEV", cveDetailEyebrow:"استخبارات الثغرات", cveLoading:"جارٍ تحميل تفاصيل الثغرة من NVD…", cveUnavailable:"تعذر جلب تفاصيل NVD مؤقتاً. يمكنك فتح سجل CVE الأصلي.", description:"الوصف", severity:"درجة الخطورة", cvssScore:"درجة CVSS", published:"تاريخ النشر", lastModified:"آخر تحديث", weaknesses:"أنواع الضعف", references:"المراجع", affectedProducts:"الأنظمة/المنتجات المتأثرة", noDescription:"لا يتوفر وصف من NVD.", notScored:"لم تُقيّم NVD الخطورة", noReferences:"لا توجد مراجع منشورة.", openNvd:"فتح سجل NVD ↗", openCve:"فتح CVE.org ↗", close:"إغلاق",
    noResults:"لا توجد نتائج مطابقة.", records:"سجلات", cisaConnected:"متصل", cisaFailed:"غير متاح", allCampaigns:"كل مؤشرات الحملات", ransomwareYes:"استخدام الفدية: معروف", ransomwareNo:"لم يُذكر استخدام الفدية", ransomwareUse:"استخدام برمجيات الفدية", requiredAction:"الإجراء المطلوب", ransomwareKnown:"مذكور", ransomwareUnknown:"غير مذكور", actionUnavailable:"لم يحدد إجراء"
  }
};
function t(key){ return translations[lang][key] || key; }
function applyLanguage(){
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if(translations[lang][key]) el.innerHTML = translations[lang][key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => el.placeholder = t(el.dataset.i18nPlaceholder));
  $("langToggle").textContent = lang === "en" ? "عربي" : "English";
  renderTable();
}
function showToast(message){ const el=$("toast"); el.textContent=message; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),3000); }
function safeDate(s){ if(!s) return "—"; const d=new Date(s+"T00:00:00"); return isNaN(d)?"—":d.toLocaleDateString(lang==="ar"?"ar-IQ":"en-US",{year:"numeric",month:"short",day:"numeric"}); }
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderTable(){
  const query=$("searchInput").value.trim().toLowerCase(), vendor=$("vendorFilter").value, ransomware=$("ransomwareFilter").value;
  const filtered=kevItems.filter(x=>{
    const hay=[x.cveID,x.vendorProject,x.product,x.vulnerabilityName].join(" ").toLowerCase();
    return (!query||hay.includes(query))&&(!vendor||x.vendorProject===vendor)&&(!ransomware||(ransomware==="Known"?x.knownRansomwareCampaignUse==="Known":x.knownRansomwareCampaignUse!=="Known"));
  }).slice(0,100);
  $("resultCount").textContent=`${filtered.length} ${t("records")}`;
  if(!filtered.length){$("kevTable").innerHTML=`<tr><td colspan="7" class="loading-cell">${t("noResults")}</td></tr>`;return;}
  $("kevTable").innerHTML=filtered.map(x=>`<tr>
    <td><button class="cve-link cve-open-button" type="button" data-cve="${esc(x.cveID)}">${esc(x.cveID)}</button></td>
    <td class="vendor-cell">${esc(x.vendorProject)}<div class="muted-cell">${esc(x.product)}</div></td>
    <td>${esc(x.vulnerabilityName)}</td><td>${safeDate(x.dateAdded)}</td><td>${safeDate(x.dueDate)}</td><td><span class="intel-tag ${x.knownRansomwareCampaignUse==="Known"?"tag-warning":"tag-muted"}">${x.knownRansomwareCampaignUse==="Known"?t("ransomwareKnown"):t("ransomwareUnknown")}</span></td><td class="action-cell">${esc(x.requiredAction||t("actionUnavailable"))}</td>
  </tr>`).join("");
}

function setActiveTab(name){
  const allowed=["overview","vulnerabilities","alerts","sources","iraq-watch","methodology"];
  const active=allowed.includes(name)?name:"overview";
  document.querySelectorAll("[data-tab-panel]").forEach(panel=>{
    panel.classList.toggle("active",panel.dataset.tabPanel===active);
  });
  document.querySelectorAll(".section-tab").forEach(button=>{
    const selected=button.dataset.tab===active;
    button.classList.toggle("active",selected);
    button.setAttribute("aria-selected",selected?"true":"false");
  });
  document.querySelectorAll(".sidebar .nav-link").forEach(link=>{
    const selected=link.getAttribute("href")==="#"+active || (active==="overview"&&link.getAttribute("href")==="#overview");
    link.classList.toggle("active",selected);
  });
  history.replaceState(null,"","#"+(active==="overview"?"overview":active));
  window.scrollTo({top:0,behavior:"smooth"});
}
document.addEventListener("click",event=>{
  const tab=event.target.closest("[data-tab]");
  if(tab){event.preventDefault();setActiveTab(tab.dataset.tab);return;}
  const link=event.target.closest(".sidebar .nav-link");
  if(link){event.preventDefault();const target=link.getAttribute("href").slice(1);setActiveTab(target==="overview"?"overview":target);}
});
function nvdText(cve, langCode) {
  const descriptions=cve.descriptions||[];
  return descriptions.find(x=>x.lang===langCode)?.value || descriptions.find(x=>x.lang==="en")?.value || t("noDescription");
}
function metricFor(cve) {
  const m=cve.metrics||{};
  return (m.cvssMetricV40||[])[0] || (m.cvssMetricV31||[])[0] || (m.cvssMetricV30||[])[0] || (m.cvssMetricV2||[])[0] || null;
}
function openCveModal() {
  $("cveModal").classList.add("open");
  $("cveModal").setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");
}
function closeCveModal() {
  $("cveModal").classList.remove("open");
  $("cveModal").setAttribute("aria-hidden","true");
  document.body.classList.remove("modal-open");
}
async function showCveDetails(id) {
  if(!/^CVE-\d{4}-\d{4,}$/i.test(id)) return;
  openCveModal();
  $("cveModalTitle").textContent=id;
  $("cveDetailBody").innerHTML=`<div class="loading-cell"><span class="spinner"></span>${t("cveLoading")}</div>`;
  try {
    const response=await fetch(`https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${encodeURIComponent(id)}`,{headers:{Accept:"application/json"}});
    if(!response.ok) throw new Error(`NVD HTTP ${response.status}`);
    const payload=await response.json();
    const cve=payload.vulnerabilities?.[0]?.cve;
    if(!cve) throw new Error("CVE not found");
    const metric=metricFor(cve);
    const cvss=metric?.cvssData;
    const severity=metric?.cvssData?.baseSeverity || metric?.baseSeverity || t("notScored");
    const score=cvss?.baseScore ?? "—";
    const weaknesses=(cve.weaknesses||[]).flatMap(w=>w.description||[]).map(w=>w.value).filter(Boolean);
    const refs=(cve.references||[]).filter(r=>typeof r.url==="string"&&(r.url.startsWith("https://")||r.url.startsWith("http://"))).slice(0,8);
    const cpeItems=[];
    const collectCpes=node=>{if(!node||typeof node!=="object")return;if(Array.isArray(node))return node.forEach(collectCpes);if(Array.isArray(node.cpeMatch))node.cpeMatch.forEach(m=>{if(m.vulnerable&&m.criteria)cpeItems.push(m.criteria);});Object.values(node).forEach(value=>{if(value&&typeof value==="object")collectCpes(value);});};
    collectCpes(cve.configurations);
    const affected=[...new Set(cpeItems)].slice(0,12);
    const severityClass=["critical","high","medium","low"].includes(String(severity).toLowerCase())?String(severity).toLowerCase():"none";
    $("cveDetailBody").innerHTML=`
      <div class="cve-metrics">
        <div class="cve-metric"><small>${esc(t("severity"))}</small><b class="severity-pill severity-${esc(severityClass)}">${esc(severity)}</b></div>
        <div class="cve-metric"><small>${esc(t("cvssScore"))}</small><b>${esc(score)}</b></div>
        <div class="cve-metric"><small>${esc(t("published"))}</small><b>${esc(safeDate((cve.published||"").slice(0,10)))}</b></div>
        <div class="cve-metric"><small>${esc(t("lastModified"))}</small><b>${esc(safeDate((cve.lastModified||"").slice(0,10)))}</b></div>
      </div>
      <section class="cve-detail-section"><h3>${esc(t("description"))}</h3><p>${esc(nvdText(cve,lang))}</p></section>
      <section class="cve-detail-section"><h3>${esc(t("weaknesses"))}</h3><p>${weaknesses.length?weaknesses.map(esc).join(" · "):"—"}</p></section>
      <section class="cve-detail-section"><h3>${esc(t("affectedProducts"))}</h3><p>${affected.length?affected.map(esc).join("<br>"):"See NVD record for affected configurations."}</p></section>
      <section class="cve-detail-section"><h3>${esc(t("references"))}</h3>${refs.length?'<ul class="cve-reference-list">'+refs.map(r=>'<li><a href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer">'+esc(r.url)+'</a></li>').join("")+'</ul>':'<p>'+esc(t("noReferences"))+'</p>'}</section>
      <div class="cve-detail-actions"><a class="outline-button" href="https://nvd.nist.gov/vuln/detail/${encodeURIComponent(id)}" target="_blank" rel="noopener noreferrer">${esc(t("openNvd"))}</a><a class="outline-button" href="https://www.cve.org/CVERecord?id=${encodeURIComponent(id)}" target="_blank" rel="noopener noreferrer">${esc(t("openCve"))}</a></div>
      <p class="cve-attribution">Source: NIST National Vulnerability Database. Data may be incomplete or updated by the publisher.</p>`;
  } catch(err) {
    console.warn("CVE detail lookup failed:",err);
    $("cveDetailBody").innerHTML=`<p class="cve-error">${esc(t("cveUnavailable"))}</p><div class="cve-detail-actions"><a class="outline-button" href="https://nvd.nist.gov/vuln/detail/${encodeURIComponent(id)}" target="_blank" rel="noopener noreferrer">${esc(t("openNvd"))}</a><a class="outline-button" href="https://www.cve.org/CVERecord?id=${encodeURIComponent(id)}" target="_blank" rel="noopener noreferrer">${esc(t("openCve"))}</a></div>`;
  }
}

function updateStats(items){
  $("kevCount").textContent=items.length.toLocaleString();
  const cutoff=new Date();cutoff.setDate(cutoff.getDate()-30);
  $("recentCount").textContent=items.filter(x=>new Date(x.dateAdded)>=cutoff).length.toLocaleString();
  $("criticalCount").textContent=items.filter(x=>x.knownRansomwareCampaignUse==="Known").length.toLocaleString();
  $("sourceCount").textContent="4";
}
async function loadKev(){
  const button=$("liveRefreshBtn");
  if(button){button.disabled=true;button.setAttribute("aria-busy","true");}
  $("feedStatus").textContent="● Connecting";
  $("cisaState").innerHTML=`<i></i><span>${t("connecting")}</span>`;
  $("kevTable").innerHTML=`<tr><td colspan="7" class="loading-cell"><span class="spinner"></span>${t("loadingIntel")}</td></tr>`;
  let data=null;
  const failures=[];
  try{
    for(const source of KEV_URLS){
      const controller=new AbortController();
      const timeout=setTimeout(()=>controller.abort(),12000);
      try{
        const res=await fetch(source.url,{cache:"no-store",headers:{Accept:"application/json"},signal:controller.signal});
        if(!res.ok) throw new Error(`HTTP ${res.status}`);
        const candidate=await res.json();
        if(!candidate||!Array.isArray(candidate.vulnerabilities)||!candidate.vulnerabilities.length) throw new Error("Invalid or empty KEV feed");
        data=candidate;
        break;
      }catch(err){
        failures.push(`${source.label}: ${err.name==="AbortError"?"timeout":err.message}`);
        console.warn("KEV source failed:",source.url,err);
      }finally{
        clearTimeout(timeout);
      }
    }
    if(!data) throw new Error(failures.join(" | ")||"No KEV source available");
    kevItems=data.vulnerabilities;
    kevItems.sort((a,b)=>new Date(b.dateAdded)-new Date(a.dateAdded));
    updateStats(kevItems);
    const vendors=[...new Set(kevItems.map(x=>x.vendorProject).filter(Boolean))].sort();
    const current=$("vendorFilter").value;
    $("vendorFilter").innerHTML=`<option value="">${t("allVendors")}</option>`+vendors.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join("");
    $("vendorFilter").value=vendors.includes(current)?current:"";
    $("lastUpdated").textContent=`${t("loaded")}: ${new Date().toLocaleTimeString(lang==="ar"?"ar-IQ":"en-US")}`;
    $("feedStatus").textContent="● Connected";
    $("cisaState").innerHTML=`<i></i><span>${t("cisaConnected")}</span>`;
    renderTable();
  }catch(err){
    console.error("KEV feed load failed:",err);
    $("feedStatus").textContent="● Unavailable";
    $("cisaState").innerHTML=`<i class="muted-dot"></i><span>${t("cisaFailed")}</span>`;
    $("kevTable").innerHTML=`<tr><td colspan="7" class="loading-cell">${t("failed")}<br><small>${esc(err.message)}</small></td></tr>`;
    $("lastUpdated").textContent=t("failed");
    showToast(t("failed"));
  }finally{
    if(button){button.disabled=false;button.removeAttribute("aria-busy");}
  }
}
$("langToggle").addEventListener("click",()=>{lang=lang==="en"?"ar":"en";localStorage.setItem("kgt-lang",lang);applyLanguage();});
$("refreshBtn").addEventListener("click",loadKev);
$("liveRefreshBtn").addEventListener("click",loadKev);
$("searchInput").addEventListener("input",renderTable);
$("vendorFilter").addEventListener("change",renderTable);
$("ransomwareFilter").addEventListener("change",renderTable);
$("kevTable").addEventListener("click",e=>{const button=e.target.closest("[data-cve]");if(button)showCveDetails(button.dataset.cve);});
$("closeCveModal").addEventListener("click",closeCveModal);
$("cveModal").addEventListener("click",e=>{if(e.target.hasAttribute("data-close-cve"))closeCveModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCveModal();});
applyLanguage();
const initialTab=location.hash.slice(1);
setActiveTab(["overview","vulnerabilities","alerts","sources","iraq-watch","methodology"].includes(initialTab)?initialTab:"overview");
loadKev();