Write-Host "Installing FontAwesome NPM packages..."

Write-Host "[core]"
npm i --save @fortawesome/fontawesome-svg-core > fontawesome-npm-install.log
if ($LASTEXITCODE -ne 0) {
  Write-Host "Failed to install core.  Exiting..."
  exit 1
}

# --- pick what you need ---
Write-Host "[icons]"
try {
  # npm i --save @fortawesome/free-brands-svg-icons >> fontawesome-npm-install.log

  # npm i --save @fortawesome/pro-solid-svg-icons  >> fontawesome-npm-install.log
  # npm i --save @fortawesome/pro-regular-svg-icons  >> fontawesome-npm-install.log
  # npm i --save @fortawesome/pro-light-svg-icons  >> fontawesome-npm-install.log
  # npm i --save @fortawesome/pro-thin-svg-icons  >> fontawesome-npm-install.log
  
  npm i --save @fortawesome/pro-duotone-svg-icons  >> fontawesome-npm-install.log
  # npm i --save @fortawesome/duotone-regular-svg-icons  >> fontawesome-npm-install.log
  # npm i --save @fortawesome/duotone-light-svg-icons  >> fontawesome-npm-install.log
  # npm i --save @fortawesome/duotone-thin-svg-icons  >> fontawesome-npm-install.log
  
  # npm i --save @fortawesome/sharp-solid-svg-icons  >> fontawesome-npm-install.log
  # npm i --save @fortawesome/sharp-regular-svg-icons  >> fontawesome-npm-install.log
  # npm i --save @fortawesome/sharp-light-svg-icons  >> fontawesome-npm-install.log
  # npm i --save @fortawesome/sharp-thin-svg-icons  >> fontawesome-npm-install.log
  
  # npm i --save @fortawesome/sharp-duotone-solid-svg-icons  >> fontawesome-npm-install.log
  # npm i --save @fortawesome/sharp-duotone-regular-svg-icons  >> fontawesome-npm-install.log
  # npm i --save @fortawesome/sharp-duotone-light-svg-icons  >> fontawesome-npm-install.log
  # npm i --save @fortawesome/sharp-duotone-thin-svg-icons  >> fontawesome-npm-install.log
} catch {
  Write-Host "Failed to install one or more icons.  Exiting..."
  Write-Host $_.Exception.Message
  exit 1
}

# --- Add the React Component
Write-Host "[component]"
npm i --save @fortawesome/angular-fontawesome@latest  >> fontawesome-npm-install.log
if ($LASTEXITCODE -ne 0) {
  Write-Host "Failed to install component.  Exiting..."
  exit 1
}

Write-Host "FontAwesome NPM packages installed successfully."
Write-Host "You can view the log at fontawesome-npm-install.log"