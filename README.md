# Next.js example

### How to use

clone the repo:

```sh
git clone http://tgcsgitlab.rtptgcs.com:20080/justin.clitheroe/rems-dashboard.git
cd nextjs
```

Install it and run:

```sh
npm install
npm run dev
```

To Build (technically anywhere but ALWAYS before you start the prod server on wmpos2)

```sh
npm install
npm run build
```

Check the status of the wmpos2 systemd process

```shell script
systemctl status nextjs
```

---

### Justin doesn't work here anymore contingency plan

##### (AKA new maintaner do this)

Get stephen to set you as the account on the systemd file (this means the process is started under your username. Also now you can kill it if you want to start it over again)

```shell script
# Killing the process would look like this
pgrep node
kill [resulting_id(s)]
```

If you've got basic sysadmin privileges, Great! all you need to do is restart the systemd process

```shell script
systemctl restart nextjs
```

if you don't (you probably don't) it's a little more involved.

If you tried to just run "npm run start" it would run
fine, however it would stop as soon as soon as you killed your ssh process, regardless of whether or not you appended it with "&"

So you've got to set up a detachable terminal using tmux ([if you don't know what tmux is watch this quick 10 min video](https://www.youtube.com/watch?v=BHhA_ZKjyxo))

```shell script
cd [folder]
# start tmux
tmux
# in the new screen start the server
npm run start
```

deattach from the tmux session using (ctrl-b)(c) (this means hit control+b, then pick up your hand and then hit "d")

now it won't die when you exit ssh
