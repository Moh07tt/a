const KEV_URLS = [
  { label: "CISA official GitHub mirror", url: "https://raw.githubusercontent.com/CISAGov/kev-data/develop/known_exploited_vulnerabilities.json" },
  { label: "CISA direct feed", url: "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json" }
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
    iraqIntel:"IRAQ CYBER INTELLIGENCE", iraqWatchTitle:"Iraq Cyber Watch", iraqWatchDesc:"Official Iraqi cybersecurity notices and public digital-safety resources.", nationalSources:"National sources", nccName:"National Cybersecurity Center of Iraq", nccDesc:"Official national cybersecurity information and advisories", nccAdvisories:"Iraqi security advisories", nccAdvisoriesDesc:"Published alerts, reports and technical guidance", amanName:"AMAN – Digital Protection", amanDesc:"Iraqi public digital-protection platform", visit:"Visit ↗", read:"Read ↗", iraqScopeTitle:"Coverage note", iraqScopeText:"This section links to official Iraqi resources. It does not yet aggregate or independently verify incidents inside Iraq.", transparency:"TRANSPARENCY", methodologyTitle:"Sources & methodology", methodologyDesc:"How this public intelligence dashboard handles information.", connectedData:"Connected data", connectedDataDesc:"CISA KEV is retrieved from its public JSON feed when the page loads. The dashboard shows the source status and refresh time.", externalReferences:"External references", externalReferencesDesc:"NVD, MITRE ATT&CK and Iraqi resources currently open their publishers websites; they are not imported into this dashboard.", editorialRule:"Editorial rule", editorialRuleDesc:"A public advisory is not proof of a local incident. Every future report should include its publisher, publication date and original link.", footerDisclaimer:"Independent project · Data belongs to its respective publishers.", failed:"Both KEV data sources are unavailable — retry later.", loaded:"CISA KEV feed updated",
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
    iraqIntel:"استخبارات العراق السيبرانية", iraqWatchTitle:"مراقبة العراق السيبرانية", iraqWatchDesc:"الإشعارات العراقية الرسمية ومصادر السلامة الرقمية العامة.", nationalSources:"مصادر وطنية", nccName:"المركز الوطني للأمن السيبراني في العراق", nccDesc:"المعلومات والإشعارات الوطنية الرسمية للأمن السيبراني", nccAdvisories:"الإشعارات الأمنية العراقية", nccAdvisoriesDesc:"تنبيهات وتقارير وإرشادات تقنية منشورة", amanName:"أمان – الحماية الرقمية", amanDesc:"منصة عراقية عامة للحماية الرقمية", visit:"زيارة ↗", read:"قراءة ↗", iraqScopeTitle:"ملاحظة حول التغطية", iraqScopeText:"يربط هذا القسم بالمصادر العراقية الرسمية. لا يجمع أو يتحقق بشكل مستقل من الحوادث داخل العراق حتى الآن.", transparency:"الشفافية", methodologyTitle:"المصادر ومنهجية العمل", methodologyDesc:"كيف تتعامل لوحة الاستخبارات العامة مع المعلومات.", connectedData:"البيانات المتصلة", connectedDataDesc:"يتم جلب CISA KEV من موجز JSON العام عند تحميل الصفحة، وتعرض اللوحة حالة المصدر ووقت التحديث.", externalReferences:"المراجع الخارجية", externalReferencesDesc:"تفتح روابط NVD وMITRE ATT&CK والمصادر العراقية مواقعها الأصلية حالياً، ولا تُستورد بياناتها إلى هذه اللوحة.", editorialRule:"القاعدة التحريرية", editorialRuleDesc:"الإشعار العام لا يثبت وقوع حادث محلي. يجب أن يتضمن كل تقرير مستقبلي الجهة الناشرة وتاريخ النشر والرابط الأصلي.", footerDisclaimer:"مشروع مستقل · البيانات ملك للجهات الناشرة.", failed:"تعذر الوصول إلى مصدري بيانات KEV — أعد المحاولة لاحقاً.", loaded:"تم تحديث بيانات CISA KEV",
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
    <td><a class="cve-link" href="https://www.cve.org/CVERecord?id=${encodeURIComponent(x.cveID)}" target="_blank" rel="noreferrer">${esc(x.cveID)}</a></td>
    <td class="vendor-cell">${esc(x.vendorProject)}<div class="muted-cell">${esc(x.product)}</div></td>
    <td>${esc(x.vulnerabilityName)}</td><td>${safeDate(x.dateAdded)}</td><td>${safeDate(x.dueDate)}</td><td><span class="intel-tag ${x.knownRansomwareCampaignUse==="Known"?"tag-warning":"tag-muted"}">${x.knownRansomwareCampaignUse==="Known"?t("ransomwareKnown"):t("ransomwareUnknown")}</span></td><td class="action-cell">${esc(x.requiredAction||t("actionUnavailable"))}</td>
  </tr>`).join("");
}
function updateStats(items){
  $("kevCount").textContent=items.length.toLocaleString();
  const cutoff=new Date();cutoff.setDate(cutoff.getDate()-30);
  $("recentCount").textContent=items.filter(x=>new Date(x.dateAdded)>=cutoff).length.toLocaleString();
  $("criticalCount").textContent=items.filter(x=>x.knownRansomwareCampaignUse==="Known").length.toLocaleString();
  $("sourceCount").textContent="4";
}
async function loadKev(){
  $("feedStatus").textContent="● Connecting";
  $("kevTable").innerHTML=`<tr><td colspan="7" class="loading-cell"><span class="spinner"></span>${t("loadingIntel")}</td></tr>`;
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
    $("kevTable").innerHTML=`<tr><td colspan="7" class="loading-cell">${t("failed")}</td></tr>`;
    $("lastUpdated").textContent=t("failed");
    showToast(t("failed"));
  }
}
$("langToggle").addEventListener("click",()=>{lang=lang==="en"?"ar":"en";localStorage.setItem("kgt-lang",lang);applyLanguage();});
$("refreshBtn").addEventListener("click",loadKev);
$("searchInput").addEventListener("input",renderTable);
$("vendorFilter").addEventListener("change",renderTable);
$("ransomwareFilter").addEventListener("change",renderTable);
applyLanguage();
loadKev();