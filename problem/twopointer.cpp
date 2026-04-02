#include <bits/stdc++.h>

using namespace std;
int n, k;
int a[1000005];
map<int,int> x;
long long res = 0;
int main(){
    int i, j;
    cin >> n >> k;
    for(i = 1; i <= n; i++) cin >> a[i];
    int l = 1;
    int r = 1;
    int s = 0;
    while(r <= n)
    {
        if(x[a[r]] == 0) s++;
        x[a[r]]++;
        while(l < r && s >= k){
            res += (n - r + 1);
            x[a[l]]--;
            if(x[a[l]] == 0) s--;
            l++;
        }
        if(s >= k) res += (n - r + 1);
        r++;
    }
    cout << res;
    return 0;
}
