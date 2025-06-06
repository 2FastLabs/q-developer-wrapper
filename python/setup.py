from setuptools import setup, find_packages

setup(
    name="q-developer-wrapper",
    version="0.0.1",
    description="Python wrapper for Q Developer CLI",
    author="Q Developer Team",
    package_dir={"": "src"},
    packages=find_packages(where="src"),
    python_requires=">=3.11",
    install_requires=[],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
)
