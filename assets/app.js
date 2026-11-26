const KEV_URLS = [
  { label: "CISA official GitHub mirror", url: "https://raw.githubusercontent.com/CISAGov/kev-data/develop/known_exploited_vulnerabilities.json" },
  { label: "CISA direct feed", url: "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json" }
];
const $ = (id) => document.getElementById(id);
let kevItems = [];
let lang = localStorage.getItem("kgt-lang") || "en";

const translations = {
  en: {
    workspace:"WORKSPACE", overview:"Overview", vulnerabilities:"Vulnerabilities", alerts:"Security alerts", sources:"Intelligence sources",
    systemOperational:"System operational", publicFeeds:"Public data feeds", liveMonitoring:"LIVE MONITORING", globalThreatMonitor:"GLOBAL THREAT MONITOR",
    dashboardTitle:"Cyber threat intelligence,<br>in one place.", dashboardSubtitle:"Monitor exploited vulnerabilities and security advisories from trusted public sources.",
    publicIntel:"PUBLIC INTELLIGENCE", waitingForData:"Waiting for data…", threatSnapshot:"THREAT SNAPSHOT", securityOverview:"Security overview", refreshData:"Refresh data",
    knownExploited:"Known exploited CVEs", cisaCatalog:"CISA KEV catalog", recentAdditions:"Recent additions", last30Days:"Added in the last 30 days",
    criticalItems:"Critical severity", fromLoadedCves:"From loaded CVE records", dataSources:"Connected sources", publicSources:"Public sources configured",
    exposureWatch:"EXPOSURE WATCH", exploitedVulnerabilities:"Known exploited vulnerabilities", exploitedDescription:"Vulnerabilities listed by CISA as exploited in the wild.",
    openCisa:"Open CISA ↗", searchPlaceholder:"Search CVE, vendor or product…", allVendors:"All vendors", cveId:"CVE ID", vendorProduct:"VENDOR / PRODUCT",
    vulnerabilityName:"VULNERABILITY", dateAdded:"DATE ADDED", dueDate:"DUE DATE", loadingIntel:"Loading intelligence feed…", cisaFootnote:"Source: CISA Known Exploited Vulnerabilities catalog.",
    priorityFeed:"PRIORITY FEED", securityAlerts:"Security alerts", verifiedSource:"Verified source", cisaAlertTitle:"CISA exploited vulnerability catalog",
    cisaAlertDesc:"Prioritize remediation for vulnerabilities known to be exploited.", nvdAlertTitle:"NVD vulnerability intelligence",
    nvdAlertDesc:"Use CVSS and CVE records to assess technical severity.", scopeNotice:"Scope note",
    scopeText:"This starter dashboard displays public vulnerability intelligence. It does not identify live victims, verify active intrusions, or execute scans.",
    intelNetwork:"INTELLIGENCE NETWORK", sourceHealth:"Source health", openData:"Open data", exploitedCatalog:"Known exploited vulnerabilities",
    connecting:"Connecting", planned:"Planned", vulnerabilityDatabase:"National Vulnerability Database", adversaryTactics:"Adversary tactics and techniques",
    threatIndicators:"Open threat indicators", sourceNote:"Additional feeds can be enabled in future releases. API keys must be stored server-side, never in browser code.",
    footerDisclaimer:"Independent project · Data belongs to its respective publishers.", failed:"Both KEV data sources are unavailable — retry later.", loaded:"CISA KEV feed updated",
    noResults:"No matching records.", records:"records", cisaConnected:"Connected", cisaFailed:"Unavailable"
  },
  ar: {
    workspace:"مساحة العمل", overview:"نظرة عامة", vulnerabilities:"الثغرات", alerts:"التنبيهات الأمنية", sources:"مصادر الاستخبارات",
    systemOperational:"النظام يعمل", publicFeeds:"مصادر بيانات عامة", liveMonitoring:"مراقبة مباشرة", globalThreatMonitor:"مراقبة التهديدات العالمية",
    dashboardTitle:"استخبارات التهديدات<br>السيبرانية في مكان واحد.", dashboardSubtitle:"تابع الثغرات المستغلة والتحذيرات الأمنية من مصادر عامة موثوقة.",
    publicIntel:"استخبارات مفتوحة", waitingForData:"بانتظار البيانات…", threatSnapshot:"ملخص التهديدات", securityOverview:"نظرة أمنية عامة", refreshData:"تحديث البيانات",
    knownExploited:"ثغرات مستغلة معروفة", cisaCatalog:"كتالوج CISA KEV", recentAdditions:"إضافات حديثة", last30Days:"أضيفت خلال آخر 30 يوماً",
    criticalItems:"خطورة حرجة", fromLoadedCves:"من سجلات الثغرات المحمّلة", dataSources:"المصادر المتصلة", publicSources:"مصادر عامة مهيأة",
    exposureWatch:"مراقبة التعرض", exploitedVulnerabilities:"الثغرات المستغلة المعروفة", exploitedDescription:"ثغرات أدرجتها CISA باعتبارها مستغلة فعلياً.",
    openCisa:"فتح CISA ↗", searchPlaceholder:"ابحث عن CVE أو شركة أو منتج…", allVendors:"كل الشركات", cveId:"معرّف CVE", vendorProduct:"الشركة / المنتج",
    vulnerabilityName:"الثغرة", dateAdded:"تاريخ الإضافة", dueDate:"الموعد النهائي", loadingIntel:"جارٍ تحميل موجز الاستخبارات…", cisaFootnote:"المصدر: كتالوج الثغرات المستغلة المعروف لدى CISA.",
    priorityFeed:"موجز الأولوية", securityAlerts:"تنبيهات أمنية", verifiedSource:"مصدر موثوق", cisaAlertTitle:"كتالوج CISA للثغرات المستغلة",
    cisaAlertDesc:"أعطِ أولوية لمعالجة الثغرات المعروفة باستغلالها.", nvdAlertTitle:"استخبارات الثغرات من NVD",
    nvdAlertDesc:"استخدم سجلات CVE ودرجات CVSS لتقييم الخطورة التقنية.", scopeNotice:"نطاق المنصة",
    scopeText:"تعرض هذه النسخة معلومات عامة عن الثغرات. لا تحدد ضحايا مباشرين، ولا تؤكد الاختراقات النشطة، ولا تنفذ عمليات فحص.",
    intelNetwork:"شبكة الاستخبارات", sourceHealth:"حالة المصادر", openData:"بيانات مفتوحة", exploitedCatalog:"الثغرات المستغلة المعروفة",
    connecting:"جارٍ الاتصال", planned:"مخطط لاحقاً", vulnerabilityDatabase:"قاعدة بيانات الثغرات الوطنية", adversaryTactics:"تكتيكات وتقنيات الخصوم",
    threatIndicators:"مؤشرات تهديد مفتوحة", sourceNote:"يمكن إضافة مصادر أخرى في الإصدارات القادمة. يجب حفظ مفاتيح API في الخادم وليس في كود المتصفح.",
    footerDisclaimer:"مشروع مستقل · البيانات ملك للجهات الناشرة.", failed:"تعذر الوصول إلى مصدري بيانات KEV — أعد المحاولة لاحقاً.", loaded:"تم تحديث بيانات CISA KEV",
    noResults:"لا توجد نتائج مطابقة.", records:"سجلات", cisaConnected:"متصل", cisaFailed:"غير متاح"
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
  const query=$("searchInput").value.trim().toLowerCase(), vendor=$("vendorFilter").value;
  const filtered=kevItems.filter(x=>{
    const hay=[x.cveID,x.vendorProject,x.product,x.vulnerabilityName].join(" ").toLowerCase();
    return (!query||hay.includes(query))&&(!vendor||x.vendorProject===vendor);
  }).slice(0,100);
  $("resultCount").textContent=`${filtered.length} ${t("records")}`;
  if(!filtered.length){$("kevTable").innerHTML=`<tr><td colspan="5" class="loading-cell">${t("noResults")}</td></tr>`;return;}
  $("kevTable").innerHTML=filtered.map(x=>`<tr>
    <td><a class="cve-link" href="https://www.cve.org/CVERecord?id=${encodeURIComponent(x.cveID)}" target="_blank" rel="noreferrer">${esc(x.cveID)}</a></td>
    <td class="vendor-cell">${esc(x.vendorProject)}<div class="muted-cell">${esc(x.product)}</div></td>
    <td>${esc(x.vulnerabilityName)}</td><td>${safeDate(x.dateAdded)}</td><td>${safeDate(x.dueDate)}</td>
  </tr>`).join("");
}
function updateStats(items){
  $("kevCount").textContent=items.length.toLocaleString();
  const cutoff=new Date();cutoff.setDate(cutoff.getDate()-30);
  $("recentCount").textContent=items.filter(x=>new Date(x.dateAdded)>=cutoff).length.toLocaleString();
  $("criticalCount").textContent="—";
  $("sourceCount").textContent="1";
}
async function loadKev(){
  $("feedStatus").textContent="● Connecting";
  $("kevTable").innerHTML=`<tr><td colspan="5" class="loading-cell"><span class="spinner"></span>${t("loadingIntel")}</td></tr>`;
  let data = null;
  let activeSource = null;
  const failures = [];
  for (const source of KEV_URLS) {
    try {
      const res = await fetch(source.url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const candidate = await res.json();
      if (!Array.isArray(candidate.vulnerabilities)) throw new Error("Unexpected feed format");
      data = candidate;
      activeSource = source;
      break;
    } catch (err) {
      failures.push(`${source.label}: ${err.message}`);
      console.warn("KEV source failed:", source.url, err);
    }
  }
  try{
    if (!data) throw new Error(failures.join(" | ") || "No KEV source available");
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
    console.error(err);
    $("feedStatus").textContent="● Unavailable";
    $("cisaState").innerHTML=`<i class="muted-dot"></i><span>${t("cisaFailed")}</span>`;
    $("kevTable").innerHTML=`<tr><td colspan="5" class="loading-cell">${t("failed")}</td></tr>`;
    $("lastUpdated").textContent=t("failed");
    showToast(t("failed"));
  }
}
$("langToggle").addEventListener("click",()=>{lang=lang==="en"?"ar":"en";localStorage.setItem("kgt-lang",lang);applyLanguage();});
$("refreshBtn").addEventListener("click",loadKev);
$("searchInput").addEventListener("input",renderTable);
$("vendorFilter").addEventListener("change",renderTable);
applyLanguage();
loadKev();