python3 -m venv ./virt/
source ./virt/bin/activate
cd ./Twitblend/
pip install -e .

echo "Installed! run 'source ./virt/bin/activate' to enter Twitblend's venv. In the venv, it acts as a regular application and can be called with 'twitblend'."
