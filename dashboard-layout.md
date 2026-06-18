# Daily Performance Dashboard Layout

Role: B2C tax return company daily management dashboard

Goal: Give management one clear daily view of sales activity, renewal activity, customer service workload, and collection performance.

## Top Summary

| KPI | What it shows | Recommended view |
| --- | --- | --- |
| Total Daily Revenue | All money collected today across sales, renewals, and collections | Large money card |
| Total Daily Sales | New sales count + renewal sales count | Large count card |
| Total Leads Generated | New leads + renewal leads | Large count card |
| Total Insurance Referrals | New sales referrals + renewal referrals + collection referrals | Large count card |
| Daily Cancellations | Cancellations from customer service | Alert card |

## Department Table

| Department | KPI | Type | Daily value | Target | Difference | Owner / notes |
| --- | --- | --- | --- | --- | --- | --- |
| New Sales | Total Sales | Count |  |  |  | Count of new paid deals |
| New Sales | Total Revenue Collected | Money |  |  |  | Money collected from new sales |
| New Sales | New Leads Generated | Count |  |  |  | Leads created that day |
| New Sales | Insurance Referrals Created | Count |  |  |  | Insurance referral records created |
| Renewal Sales | Total Renewal Sales | Count |  |  |  | Count of renewal deals |
| Renewal Sales | Total Renewal Revenue | Money |  |  |  | Money collected from renewals |
| Renewal Sales | Renewal Leads Generated | Count |  |  |  | Renewal leads created that day |
| Renewal Sales | Renewal Insurance Referrals Created | Count |  |  |  | Insurance referrals from renewals |
| Customer Service | Total Incoming Calls / Missions Received | Count |  |  |  | All incoming service workload |
| Customer Service | Total Calls Answered | Count |  |  |  | Answered calls only |
| Customer Service | Daily Cancellations | Count |  |  |  | Cancellations created that day |
| Customer Service | Sales Generated via Service | Count / Money |  |  |  | Sales created from service activity |
| Collection | Total General Money Collected | Money |  |  |  | Collection payments not tied to tax-return success fee |
| Collection | Referrals Generated | Count |  |  |  | Referrals created by collection department |
| Collection | Revenue Collected from Successful Tax Returns | Money |  |  |  | Money collected from refund-success fees that day |

## Department Sections

### New Sales Department

| Salesperson | Sales count | Revenue collected | Leads generated | Insurance referrals | Conversion notes |
| --- | ---: | ---: | ---: | ---: | --- |
|  |  |  |  |  |  |

Best visual:
- Ranking table by salesperson.
- Bar chart for revenue collected.
- Small KPI cards for sales count, revenue, leads, and referrals.

### Renewal Sales Department

| Salesperson | Renewal sales count | Renewal revenue | Renewal leads | Renewal insurance referrals | Notes |
| --- | ---: | ---: | ---: | ---: | --- |
|  |  |  |  |  |  |

Best visual:
- Ranking table by renewal salesperson.
- Stacked comparison between renewal sales count and renewal revenue.
- KPI cards for renewal sales, revenue, leads, and referrals.

### Customer Service Department

| Representative | Incoming calls / missions | Calls answered | Answer rate | Cancellations | Sales via service |
| --- | ---: | ---: | ---: | ---: | ---: |
|  |  |  |  |  |  |

Best visual:
- Workload card: incoming calls/missions.
- Answer-rate gauge or progress bar.
- Cancellation alert card.
- Ranking table by answered calls and sales via service.

### Collection Department

| Collector | General money collected | Refund-success revenue | Total collected | Referrals generated | Notes |
| --- | ---: | ---: | ---: | ---: | --- |
|  |  |  |  |  |  |

Best visual:
- Money cards split between general collection and successful tax-return revenue.
- Ranking table by collector.
- Bar chart for total collected.
- Referral count card.

## Recommended Dashboard Layout

1. Header
   - Dashboard name
   - Selected date
   - Last upload/export time
   - Language toggle if needed

2. Executive summary row
   - Total Daily Revenue
   - Total Daily Sales
   - Total Leads Generated
   - Total Insurance Referrals
   - Daily Cancellations

3. Department scorecards
   - Four wide cards: New Sales, Renewal Sales, Customer Service, Collection
   - Each card shows the department's main 3-5 daily KPIs

4. Management ranking tables
   - One table per department
   - Sort by the department's main success metric

5. Detail drill-down
   - Click a person or department to see row-level activity
   - Include CRM/customer links when customer ID exists

## Best Visualizations

| Need | Best visual |
| --- | --- |
| Fast daily status | KPI cards |
| Compare people | Ranking table |
| Compare departments | Department scorecards |
| Track money by source | Bar chart or stacked bar |
| Track service efficiency | Answer-rate progress bar |
| Flag problems | Alert cards for cancellations and low answer rate |
| Share static result | Locked/exported HTML summary |

## Suggested Management View

The first screen should be simple:

| Section | Purpose |
| --- | --- |
| Top cards | Tell if today is good or bad in 10 seconds |
| Department cards | Show which department is strong or weak |
| Ranking tables | Show which person needs praise or attention |
| Drill-down | Let management investigate the reason behind the number |

Avoid making the first screen too crowded. Keep raw rows and advanced details behind clicks or lower on the page.
