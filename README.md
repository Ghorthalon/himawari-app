# Himawari
## WebRTC voice calls that just work

Himawari is a small app written in Node.JS and React that let's you make quick voice calls using your browser.

## Motivation

I wanted an app that would quickly let me share a link and have people join a voice conference. These people should not need to create an account, not login anywhere, just join the link and get talking with the minimum amount of steps necessary. This included not installing some software. WebRTC seemed like the perfect solution.
I tried several WebRTC apps, yet none of them seemed to work well with the calls simply not connecting being the most popular problem. That's what I wanted to solve.

You can simpy go to the URL and append a random room name. For example
```
https://himawari-domain.example.com/test/
```
would create a room called test if nobody had done so, or if it already existed simply join me in the conference. This is the same as entering `test` in the room name box on the main page.

## How to run

Himawari operates on afull mesh network, so no voice data goes through the server if it's not absolutely necessary. One instance where it might is you being behind a symmetric NAT or other firewall which will make a direct connection impossible. However, WebRTC specifications require the communications to be very firmly encrypted, meaning your data is safe.

### I want to host my own instance

There are two parts to getting this working.

The first is the [server](https://github.com/ghorthalon/himawari-server/), which is used to create the rooms, etc. See it's readme to find out how to build it.

This app is hacked together in React. To run, you will

```
git clone https://github.com/ghorthalon/himawari-app/
npm install
npm run dev
```

Note that you must first create a configuration file. An example configuration is provided in src/data/config.json.example, and should be self explanatory. I will expand on this documentation once everything is set up properly.