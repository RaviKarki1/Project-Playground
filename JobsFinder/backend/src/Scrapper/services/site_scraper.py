from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By

import os

load_dotenv()
chrome_driver_path = os.getenv('DRIVER_PATH_CHROME')
service=Service(executable_path=chrome_driver_path)
driver=webdriver.Chrome(service=service)

driver.get("https://www.seek.com.au/")


# title_elements = driver.find_elements(By.XPATH, '//tr[contains(@class, "athing")]/td[@class="title"]/span[@class="titleline"]/a')
# for i, title in enumerate(title_elements, start=1):
#     print(f"{i}. {title.text} || {title.get_attribute('href')}")


input("Press enter to quit.")
driver.quit()