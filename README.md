# LES Study Analysis
Python code to analyze data from user studies conducted using [LES](https://github.com/NUDelta/low-effort-sensing).

## Setup and Use
### Install Python 3 and Conda
We use **python 3** with the **anaconda** package manager. To install this, we recommend installing [Miniconda](https://conda.io/miniconda.html). Don't make a conda envrionment yet as we will do this in the next step. 

### Create a conda env with required packages
Open Terminal and navigate to the cloned repository. Run `conda env create -n les -f environment.yml` to create a new conda env and install all the required packages for our project. Then, run `source activate les` to start the virtual environment. Note that you will need to source the environment each time you wish to use or view our code. When finished, you can run  `source deactivate` to stop the virtual environment. 

### Updating conda env with new packages
If you install new packages to use, please run `conda env export | grep -v "^prefix: " > environment.yml` to create a new environment.yml file with the packages included. 

### Running and Modifying Code
All analysis is done in Jupyter notebooks. To start the notebook, run `jupyter notebook les-study-analysis.ipynb` and open your web browser
