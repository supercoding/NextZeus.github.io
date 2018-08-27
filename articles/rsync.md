# RSYNC 同步文件到服务器，下载服务器文件到本地

```

#!/bin/bash

set -e
set -o pipefail

ssh -tt "root@host" "mkdir -p /data/work/helloworld"

rsync -avcrzl --delete-after --exclude node_modules/ --exclude package-lock.json ./ -e 'ssh' "root@host:/data/work/helloworld/"

# rsync -avcrzl -e "ssh -i nextzeus.pem" ./ root@host:/data/work/

# download /data/work/download
rsync -avcrzl --progress root@host:/data/work/download ./


```

## option

- a: archive
- v: verbose
- c: 
- r: recursive 递归拷贝目录
- z: compress 压缩上传 减小数据量大小
- l: 
- exclude 排除 , (not ./xxx ,but xxx/)
- delete-after
- process 进度