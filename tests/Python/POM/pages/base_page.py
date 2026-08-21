from playwright.sync_api import Page, Locator


class BasePage:
    def __init__(self, page: Page):
        self.page = page
        self.url = 'C:\Users\lenovo\education\Amazonia_Medievalis\init.html'

    def navigate(self):
        self.page.goto(self.url)

    def wait_for_element(self, selector: str, timeout: int = 5000):
        return self.page.locator(selector).first.wait_for(timeout=timeout)