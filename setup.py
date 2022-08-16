from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in fieldtime_tracker/__init__.py
from fieldtime_tracker import __version__ as version

setup(
	name="fieldtime_tracker",
	version=version,
	description="Tracker amount of time spent on site",
	author="Jide Olayinka",
	author_email="spryng.managed@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
