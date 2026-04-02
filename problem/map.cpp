#include <bits/stdc++.h>

using namespace std;
int b[100005];
int main() {
    int i, j, n;
    map <int, int> a;
    scanf("%d",&n);
    for(i = 1; i <= n; i++)
    {
        scanf("%d",&b[i]);
        a[b[i]]++;
    }
    for(i = 1; i <= n; i++)
    {
        printf("%d ", a[b[i]]);
    }
    return 0;
}

