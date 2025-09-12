from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    context = browser.new_context(
        viewport={'width': 375, 'height': 812},
        is_mobile=True,
        user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1'
    )
    page = context.new_page()

    # Navigate to Truck Owner dashboard
    page.goto('http://localhost:3000/dashboard/truck-owner')
    page.screenshot(path='jules-scratch/verification/truck-owner-dashboard.png')

    # Navigate to Shipper dashboard
    page.goto('http://localhost:3000/dashboard/shipper')
    page.screenshot(path='jules-scratch/verification/shipper-dashboard.png')

    # Navigate to Admin dashboard
    page.goto('http://localhost:3000/dashboard/admin')
    page.screenshot(path='jules-scratch/verification/admin-dashboard.png')

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
