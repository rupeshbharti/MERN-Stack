// 1
with RankedSalaries as (
    select
        d.dept_name,
        e.emp_name,
        e.salary,
        DENSE_RANK() over(
            partition by e.dept_name
            order by e.salary desc
        ) as salary_rank
    from employee e
    join department d
    on e.dept_id = d.dept_id
)
select 
    dept_name,
    emp_name,
    salary
from RankedSalaries
where salary_rank = 2;

// 2
select
    c.customer_id,
    c.customer_name,
    MIN(order_date) as order_date
from customer c
join orders o
    on c.customer_id = o.customer_id
join campaign cmp
    on o.campaign_id = cmp.campaign_id
where o.status = "Completed"
group by
    c.customer_id,
    c.customer_name
having
    COUNT(o.order_id) = 1
    AND MAX(cmp.channel) = 'Paid Search'
    AND MAX(EXTRACT(YEAR FROM o.order_date)) = 2025;

// 3

select 
    m.emp_name as manager_id ,
    m.emp_name,
    m.salary,
    round(avg(e.salary), 2) as avg_salary
from employees m
join employees e
    on e.employee_id = m.manager_id


Schema 1: E-Commerce & Marketing
customers(customer_id, customer_name, joined_date, country)

campaigns(campaign_id, campaign_name, budget, channel)

orders(order_id, customer_id, campaign_id, order_date, total_amount, status)

Schema 2: Corporate & HR
departments(dept_id, dept_name, location)

employees(emp_id, emp_name, dept_id, manager_id, salary, hire_date)

projects(project_id, dept_id, budget)

project_assignments(emp_id, project_id, assigned_date, hours_logged)

// 4 
Problem: For each campaign, calculate the total revenue generated in each calendar month of 2025, 
along with the month-over-month revenue percentage change. Display campaign_name, month (e.g., '2025-01'), 
current_month_revenue, and pct_growth.

Key concepts: DATE_FORMAT / DATE_TRUNC, LAG() window function, handling division by zero / NULL.

// --->
select 
    c.campaign_id,
    c.campaign_name,
    DATE_FORMAT(o.order_date, '%Y-%m') as month,
    SUM(o.total_amount) as current_month_revenue
from compaign c
join order o
    on c.campaign_id = o.campaign_id
where o.status = 'completed' 
    and o.order_date = '2025-01-01'
    and o.order_date = '2026-01-01'
group by
    c.campaign_id,
        c.campaign_name,
        DATE_FORMAT(o.order_date, '%Y-%m')
),
RevenueWithLag AS (
    SELECT 
        campaign_name,
        month,
        current_month_revenue,
        LAG(current_month_revenue) OVER (
            PARTITION BY campaign_id 
            ORDER BY month
        ) AS previous_month_revenue
    FROM MonthlyCampaignRevenue
)
SELECT 
    campaign_name,
    month,
    current_month_revenue,
    CASE 
        WHEN previous_month_revenue IS NULL THEN NULL
        WHEN previous_month_revenue = 0 THEN NULL
        ELSE ROUND(
            ((current_month_revenue - previous_month_revenue) * 100.0) / previous_month_revenue, 
            2
        )
    END AS pct_growth
FROM RevenueWithLag
ORDER BY 
    campaign_name,
    month;


// 5

with Valid2025order(
select 
    c.customer_id,
    c.customer_name,
    o.total_amount,
    quarter(o.order_date) as order_quarter
from customer c
join order o
    on c.customer_id = o.customer_id
where o.status = 'Completed'
        and o.order_date > '2025-01-01'
        and o.order_date < '2025-01-01'
)
select
    customer_id,
    customer_name,
    sum(total_amount) as total_spend_2025
from Valid2025order
group by 
    customer_id,
    customer_name
having
    count(distinct order_quarter) = 4;

// 6
with ActualCost(
select
    p.project_id,
    d.dept_name,
    p.budget,
    (e.salary / 2000) * a.hours_logged as actual_cost
from  Project p
join department d
    on p.dept_id = d.dept_id
join employees e
    on a.emp_id = e.emp_id
join project_assignments a
    on p.project_id = a.project_id
)

select
    project_id,
    dept_name,
    budget,
    round(sum(actual_cost), 2) as real_cost
from ActualCost
group by
    project_id,
    dept_name,
    budget,
having
    sum(actual_cost) > budget;


// 7

with customerSpend DENSE_RANK(
    select
        c.country,
        c.customer_name,
        sum(total_amount)
        ROW_NUMBER() over (
            partition by country
            order by total_amount desc,
            join_date asc) as rank
    from customer c
    join order o
        on c.customer_id = o.order_id
),
with RankedCustomer()

// 9

with Department

function() OVER(
    PARTITION BY column
    ORDER BY column
)

select d.dept, d.d_name, e.emp,
    AVG(salary) over(
        PARTITION By department
    )
from employee e;


// Window Functions and CTE
with ranked_employee as (
    select *,
        Rank() over(
            partition by department
            order by salary desc
        ) as rank
    from employees
)
select * 
from ranked_employee
where rnk = 1;


// Dentsu Question

SELECT 
    campaign_id,
    campaign_name,
    channel,
    budget,
    COUNT(CASE WHEN status = 'Completed' THEN 1 END) AS completed_order_count
FROM campaign c
LEFT JOIN orders o
    ON c.campaign = o.campaign
where c.budget > 5000
GROUP BY
    campaign,
    campaign_id,
    campaign_name,
    channel
Having
    count(case when status = 'completed' then 1 end) > 3
order by 
        budget desc,
        campaign_name asc;


WITH HighBudget AS (
    SELECT
        c.campaign_id,
        c.campaign_name,
        c.channel,
        c.budget,
        COUNT(CASE WHEN o.status = 'Completed' THEN 1 END) AS completed_order_count
    FROM campaigns c
    LEFT JOIN orders o
        ON o.campaign_id = c.campaign_id
    WHERE c.budget > 5000.00
    GROUP BY
        c.campaign_id,
        c.campaign_name,
        c.channel,
        c.budget
    HAVING 
        COUNT(CASE WHEN o.status = 'Completed' THEN 1 END) < 3
)
SELECT 
    campaign_id,
    campaign_name,
    channel,
    budget,
    completed_order_count
FROM HighBudget
ORDER BY
    budget DESC,
    campaign_name ASC;