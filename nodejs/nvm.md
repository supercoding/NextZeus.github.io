# Set default node version with NVM

```

I was recently figuring out how to use nvm, and one thing that stood out to me is that I needed to set the default version of node that I wanted to use when opening a new tab.

Because I was new to using nvm it took me a while to find the commands. So, if you happen to find this article while configuring nvm, hopefully you find this useful.

# Install the version that you would like 
nvm install 6.1.0

# Set 6.1.0 (or another version) as default
nvm alias default 6.1.0

Then you can open a new tab and if you run node -v, you should see v6.1.0 (or whichever version you set as the default.

Easy peasy, right? Hopefully this helps you if you’re having some issues!

```
