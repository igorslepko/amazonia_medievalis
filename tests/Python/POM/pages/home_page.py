from playwright.sync_api import Page


class HomePage:
    def __init__(self, page: Page):
        self.page = page

        #locators
        self.product_card = "[data-testid^='product-']"
        self.product_name = "[data-testid^='product-name-']"
        self.product_price = "[data-testid^='product-price-']"
        self.add_btn = "[.add-btn]"
        self.search_input = "[#searchInput]"
        self.search_btn = "[searchBtn]"
