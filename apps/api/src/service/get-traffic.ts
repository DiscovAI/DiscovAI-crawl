const cleanTrafficData = (source) => {
  const {
    Engagments,
    EstimatedMonthlyVisits,
    TrafficSources,
    TopCountryShares,
    Countries,
    TopKeywords,
  } = source;
  const totalVistsLast3Month = Object.values(EstimatedMonthlyVisits).reduce(
    (p: any, c: any) => p + c,
    0
  );
  const topRegions = TopCountryShares.map((t) => {
    const country = Countries.find((c) => c.Code === t.CountryCode);
    return {
      ...t,
      name: country.Name,
      slug: country.UrlCode,
    };
  });

  const output = {
    site: source.SiteName,
    updatedAt: source.SnapshotDate,
    overview: {
      totalVistsLast3Month,
      visitsLastMonth: Engagments.Visits ? Number(Engagments.Visits) : 0,
      bounceRate: Engagments.BounceRate ? Number(Engagments.BounceRate) : 0,
      month: Engagments.Month,
      year: Engagments.Year,
      pagePerVisit: Engagments.PagePerVisit
        ? Number(Engagments.PagePerVisit)
        : 0,
      timeOnSite: Engagments.TimeOnSite ? Number(Engagments.TimeOnSite) : 0,
      hostname: source.SiteName,
      globalRank: source.GlobalRank.Rank,
      countryRank: source.CountryRank.Rank,
    },
    monthlyVisits: EstimatedMonthlyVisits,
    trafficSources: {
      social: TrafficSources.Social,
      paidReferrals: TrafficSources["Paid Referrals"],
      mail: TrafficSources.Mail,
      referrals: TrafficSources.Referrals,
      search: TrafficSources.Search,
      direct: TrafficSources.Direct,
    },
    topRegions: topRegions,
    topKeywords: TopKeywords.map((p) => ({
      name: p.Name,
      estimatedValue: p.EstimatedValue,
      volume: p.Volume,
      cpc: p.Cpc,
    })),
  };
  return output;
};
async function trafficFetch(url) {
  try {
    const resp = await fetch(
      `https://data.similarweb.com/api/v1/data?domain=${url}`
    );
    return await resp.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getTraffic(url) {
  try {
    const resp = await trafficFetch(url);
    if (!resp) throw new Error("traffic failed");
    return cleanTrafficData(resp);
  } catch (error) {
    return null;
  }
}
