#!/bin/bash
#遇到任何错误则终止脚本
set -e
set -o pipefail

res_server_config_file="package.json"

version=$(cat ${res_server_config_file} | grep version | awk -F"\"" '{print $4}' | sed 's/\//\\&/g')
echo "old version: ${version}"

version_array=(`echo $version | tr '.' ' '`)
echo "version_array ${version_array}"
version_a=${version_array[0]}
version_b=${version_array[1]}
version_c=${version_array[2]}
version_d=${version_array[3]}

version_array_length=${#version_array[@]}

if [ $version_array_length -eq 4 ]; then
	version="${version_a}\.${version_b}\.${version_c}\.${version_d}"
	((version_d++))
	version_new="${version_a}\.${version_b}\.${version_c}\.${version_d}"
	build_tag="${version_a}.${version_b}.${version_c}.${version_d}"
else
	version="${version_a}\.${version_b}\.${version_c}"
	((version_c++))
	version_new="${version_a}\.${version_b}\.${version_c}"
	build_tag="${version_a}.${version_b}.${version_c}"
fi

echo "new version: ${build_tag}"

sed -i '' "s/version\"\: \"${version}/version\"\: \"${version_new}/g" "${res_server_config_file}"

tag_name="${build_tag}"
git tag "${tag_name}"
git add package.json
git commit -a -m 'update tag version'
git push origin "${tag_name}" --tags
